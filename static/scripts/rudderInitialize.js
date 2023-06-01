export async function rudderInitialize() {
    window.rudderanalytics = await import("rudder-sdk-js");
    rudderanalytics.load("2QZQtWRgHfXP5H2cnzSR8xE9ZBZ", "https://geteppojohdkq.dataplane.rudderstack.com", {
      integrations: { All: true }, // load call options
    });
  }
  