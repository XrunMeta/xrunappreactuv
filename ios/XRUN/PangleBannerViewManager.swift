import Foundation
import React
import UIKit
import PAGAdSDK

@objc(PangleBannerViewManager)
class PangleBannerViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool { true }
  override func view() -> UIView! { PangleBannerView() }
}

class PangleBannerView: UIView {
  private var bannerAd: PAGBannerAd?
  private var loadedAdUnitId: String = ""

  @objc var adUnitId: String = "" {
    didSet {
      if !adUnitId.isEmpty && adUnitId != loadedAdUnitId {
        loadedAdUnitId = adUnitId
        loadBanner()
      }
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    backgroundColor = .clear
  }
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    backgroundColor = .clear
  }

  private func loadBanner() {

    let request = PAGBannerRequest(bannerSize: .banner320_50)
    PAGBannerAd.load(withSlotID: adUnitId, request: request) { [weak self] ad, error in
      guard let self = self else { return }
      if let error = error {
        print("[PangleBanner] load fail: \(error.localizedDescription)")
        return
      }
      guard let ad = ad else {
        print("[PangleBanner] ad nil")
        return
      }
      self.bannerAd = ad
      DispatchQueue.main.async {
        self.subviews.forEach { $0.removeFromSuperview() }
        let bannerView = ad.bannerView
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        self.addSubview(bannerView)
        NSLayoutConstraint.activate([
          bannerView.centerXAnchor.constraint(equalTo: self.centerXAnchor),
          bannerView.centerYAnchor.constraint(equalTo: self.centerYAnchor),
          bannerView.widthAnchor.constraint(equalToConstant: 320),
          bannerView.heightAnchor.constraint(equalToConstant: 50),
        ])
      }
    }
  }
}
