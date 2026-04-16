import Foundation
import React
import UIKit
import AdisonOfferwallSDK

@objc(AdisonModule)
class AdisonModule: NSObject {

  private var isInitialized = false

  @objc
  static func requiresMainQueueSetup() -> Bool { return true }

  @objc
  func initialize(
    _ appKey: String,
    server: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      if self.isInitialized {
        resolve(true)
        return
      }

      Adison.shared.initialize(appId: appKey)
      if server.lowercased() == "development" {
        Adison.shared.setServer(.development)
      } else {
        Adison.shared.setServer(.production)
      }
      self.isInitialized = true
      NSLog("[Adison] initialize ok: server=%@", server)
      resolve(true)
    }
  }

  @objc
  func setConfig(
    _ offerwallTitle: String,
    listType: String,
    themeMode: String
  ) {
    DispatchQueue.main.async {
      let config = AdisonConfig()
      config.offerwallListTitle = offerwallTitle
      config.listType = (listType.uppercased() == "FEED") ? .feed : .list
      config.prepareViewHidden = true
      switch themeMode {
      case "Dark":   config.themeMode = .dark
      case "System": config.themeMode = .system
      default:       config.themeMode = .light
      }
      Adison.shared.config = config
    }
  }

  @objc
  func setUid(_ uid: String) {
    DispatchQueue.main.async {
      Adison.shared.uid = uid
    }
  }

  @objc
  func unsetUid() {
    DispatchQueue.main.async {
      Adison.shared.uid = nil
    }
  }

  @objc
  func setTargeting(_ birthYear: NSNumber, gender: NSString?) {
    DispatchQueue.main.async {
      if birthYear.intValue > 0 {
        Adison.shared.birthYear = birthYear.intValue
      }
      if let g = gender as String? {
        switch g.uppercased() {
        case "M": Adison.shared.gender = .male
        case "F": Adison.shared.gender = .female
        default: break
        }
      }
    }
  }

  @objc
  func showOfferwall(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard self.isInitialized else {
        reject("NOT_INITIALIZED", "Adison SDK not initialized", nil)
        return
      }
      guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
        reject("NO_ROOT_VC", "No root view controller", nil)
        return
      }
      Adison.shared.presentOfferwall(from: rootVC)
      resolve(true)
    }
  }

  @objc
  func showOfferwallAd(
    _ adId: NSNumber,
    keepParent: Bool,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard self.isInitialized else {
        reject("NOT_INITIALIZED", "Adison SDK not initialized", nil)
        return
      }
      guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
        reject("NO_ROOT_VC", "No root view controller", nil)
        return
      }
      Adison.shared.presentOfferwall(from: rootVC, adId: adId.intValue, keepParent: keepParent)
      resolve(true)
    }
  }

  @objc
  func availableReward(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      Adison.shared.availableReward { name, unit, points in
        resolve([
          "name": name ?? "",
          "unit": unit ?? "",
          "points": points,
        ])
      }
    }
  }
}
