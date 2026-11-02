package app.trymyfuture

import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

/** The APK carries no model key. Pairing authorizes a private HTTPS or USB demo server. */
class GuideClient {
    private val connections = ConcurrentHashMap<String, HttpURLConnection>()
    var token: String = ""
    val usbPreview: Boolean = BuildConfig.GUIDE_ORIGIN.isEmpty() && BuildConfig.DEBUG
    private val origin = BuildConfig.GUIDE_ORIGIN.ifEmpty { if (usbPreview) "http://127.0.0.1:4317" else "" }

    suspend fun request(id: String, path: String, body: String? = null): JSONObject = withContext(Dispatchers.IO) {
        check(origin.isNotEmpty()) { "This build needs a configured HTTPS guide service. USB preview is debug-only." }
        check(path in setOf("ask", "pair", "status")) { "Unknown guide action." }
        val connection = URL("$origin/api/$path").openConnection() as HttpURLConnection
        connections[id] = connection
        try {
            connection.connectTimeout = 8000
            connection.readTimeout = 50000
            connection.instanceFollowRedirects = false
            connection.setRequestProperty("Accept", "application/json")
            if (token.isNotEmpty()) connection.setRequestProperty("Authorization", "Bearer $token")
            if (body != null) {
                connection.requestMethod = "POST"
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            }
            val code = connection.responseCode
            if (code == 401) token = ""
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val text = stream?.bufferedReader(Charsets.UTF_8)?.use { reader ->
                val output = StringBuilder()
                val buffer = CharArray(4096)
                while (true) {
                    val count = reader.read(buffer)
                    if (count < 0) break
                    output.append(buffer, 0, count)
                    check(output.length <= 65536) { "Guide response was too large." }
                }
                output.toString()
            } ?: error("Guide server returned no answer.")
            val result = JSONObject(text)
            check(code in 200..299) { result.optString("message", "The guide could not answer. Try again.") }
            result
        } finally { connections.remove(id); connection.disconnect() }
    }

    fun cancel(id: String) { connections.remove(id)?.disconnect() }
    fun close() { connections.keys.toList().forEach(::cancel) }
}
