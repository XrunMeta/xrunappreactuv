

import Foundation
import React

@objc(PangleBannerViewManager)
class PangleBannerViewManager: RCTViewManager {

  override func view() -> UIView! {
    return PangleBannerView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
