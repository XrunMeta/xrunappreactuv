import Foundation
import React
import UIKit
import AyetSDK

private let AYET_PLACEMENT_ID_IOS = 22062

@objc(AyetOfferwallModule)
class AyetOfferwallModule: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func setUserId(_ userId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let id = (userId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "guest" : userId)
    let safeId = String(id.prefix(63))
    DispatchQueue.main.async {
      AyetSDK.shared.initialize(placementId: AYET_PLACEMENT_ID_IOS, externalIdentifier: safeId)
      resolve(NSNull())
    }
  }

  @objc
  func showOfferwall(_ adSlotName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      await AyetSDK.shared.showOfferwall(adSlotName: adSlotName)
      resolve(NSNull())
    }
  }

  @objc
  func getOffers(_ adSlotName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      if let json = await AyetSDK.shared.getOffers(adSlotName: adSlotName) {
        resolve(json)
      } else {
        resolve("[]")
      }
    }
  }
}
