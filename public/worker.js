

var responseContent =
  "<html>" +
  "<body>" +
  "<style>" +
  "body {text-align: center; background-color: #333; color: #eee;}" +
  "</style>" +
  "<h1>Gotham Imperial Hotel</h1>" +
  "<p>There seems to be a problem with your connection.</p>" +
  "<p>Come visit us at 1 Imperial Plaza, Gotham City for free WiFi.</p>" +
  "</body>" +
  "</html>";

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      console.log('offline mode')
      return new Response(
        "Welcome to the Gotham Imperial Hotel.\n" +
          "There seems to be a problem with your connection.\n" +
          "We look forward to telling you about our hotel as soon as you go online."
      );
    })
  );
});

