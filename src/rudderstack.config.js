import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

let rudderstackReady = false
let rudder

if (ExecutionEnvironment.canUseDOM) {
  import('rudder-sdk-js').then((rudderanalytics) => {
    rudderanalytics.load('2QZQtWRgHfXP5H2cnzSR8xE9ZBZ', 'https://geteppojohdkq.dataplane.rudderstack.com')
    rudderanalytics.ready(() => {
      rudder = rudderanalytics
      rudderstackReady = true
    })
  })
}

export async function onRouteDidUpdate ({ location, previousLocation }) {
  // Don't execute if we are still on the same page; the lifecycle may be fired
  // because the hash changes (e.g. when navigating between headings)
  if (ExecutionEnvironment.canUseDOM && rudderstackReady && location.pathname !== previousLocation?.pathname) {
    rudder.page()
  }
}
