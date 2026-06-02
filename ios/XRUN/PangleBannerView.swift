

import Foundation
import UIKit
import React
import PAGAdSDK

@objc(PangleBannerView)
class PangleBannerView: UIView, PAGBannerAdDelegate {

  private var bannerAd: PAGBannerAd?
  private var bannerView: UIView?

  @objc var slotId: NSString = "" {
    didSet { loadAdIfReady() }
  }
  @objc var onAdLoaded: RCTDirectEventBlock?
  @objc var onAdFailedToLoad: RCTDirectEventBlock?
  @objc var onAdClicked: RCTDirectEventBlock?
  @objc var onAdImpression: RCTDirectEventBlock?

  override init(frame: CGRect) {
    super.init(frame: frame)
    self.backgroundColor = .clear
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    self.backgroundColor = .clear
  }

  private func loadAdIfReady() {
    guard !(slotId as String).isEmpty, bannerAd == nil else { return }
    DispatchQueue.main.async { [weak self] in
      self?.loadBanner()
    }
  }

  private func loadBanner() {

    let request = PAGBannerRequest(bannerSize: PAGBannerSize.banner320_50)
    PAGBannerAd.load(withSlotID: slotId as String, request: request) { [weak self] (ad, error) in
      guard let self = self else { return }
      if let err = error {
        NSLog("[PangleBanner] load failed slot=\(self.slotId) err=\(err.localizedDescription)")
        self.onAdFailedToLoad?(["error": err.localizedDescription])
        return
      }
      guard let banner = ad else {
        self.onAdFailedToLoad?(["error": "ad nil"])
        return
      }
      self.bannerAd = banner
      banner.delegate = self
      banner.rootViewController = self.findViewController()
      let bv = banner.bannerView
      bv.frame = self.bounds
      bv.autoresizingMask = [.flexibleWidth, .flexibleHeight]
      self.addSubview(bv)
      self.bannerView = bv
      self.onAdLoaded?([:])
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    bannerView?.frame = self.bounds
  }

  private func findViewController() -> UIViewController? {
    var responder: UIResponder? = self
    while let r = responder {
      if let vc = r as? UIViewController { return vc }
      responder = r.next
    }
    return UIApplication.shared.keyWindow?.rootViewController
  }

  func adDidShow(_ ad: PAGAdProtocol) {
    onAdImpression?([:])
  }
  func adDidClick(_ ad: PAGAdProtocol) {
    onAdClicked?([:])
  }
  func adDidDismiss(_ ad: PAGAdProtocol) {

  }
}
