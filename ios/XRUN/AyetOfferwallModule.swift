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
      let ready = await Self.waitForAyetInitialized(timeoutSeconds: 25)
      if !ready {
        reject("E_AYET_INIT", "ayeT SDK 초기화 실패 또는 시간 초과. 네트워크·placement(22062)·앱 키를 확인하세요.", nil)
        return
      }

      let slotId = Int(adSlotName) ?? Self.offerwallAdSlotIdReflect(named: adSlotName)
      guard let adSlot = slotId else {
        reject(
          "E_AYET_SLOT",
          "Offerwall AdSlot '\(adSlotName)' 없음. 대시보드에서 이름(예: XRun)·타입 offerwall·iOS placement를 확인하세요.",
          nil
        )
        return
      }

      guard let ext = AyetSDK.shared.getExternalIdentifier(), !ext.isEmpty else {
        reject("E_AYET_EXT", "external_identifier가 비어 있습니다. 로그인 후 다시 시도하세요.", nil)
        return
      }

      var comp = URLComponents(string: "https://offerwall.ayet.io/offers")
      comp?.queryItems = [
        URLQueryItem(name: "adSlot", value: String(adSlot)),
        URLQueryItem(name: "external_identifier", value: ext),
        URLQueryItem(name: "iosSdk", value: "true"),
      ]
      guard let url = comp?.url else {
        reject("E_AYET_URL", "오퍼월 URL을 만들 수 없습니다.", nil)
        return
      }

      NSLog("[ayeT] XRUN showOfferwall adSlot=%d name=%@ url=%@", adSlot, adSlotName, url.absoluteString)
      XRUNAyetOfferwallPresenter.present(url: url, userAgent: nil)
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

  private static func waitForAyetInitialized(timeoutSeconds: TimeInterval) async -> Bool {
    let deadline = Date().addingTimeInterval(timeoutSeconds)
    while Date() < deadline {
      if await AyetSDK.shared.checkIsInitialized() {
        return true
      }
      try? await Task.sleep(nanoseconds: 100_000_000)
    }
    return await AyetSDK.shared.checkIsInitialized()
  }

  private static func offerwallAdSlotIdReflect(named name: String) -> Int? {
    let mirror = Mirror(reflecting: AyetSDK.shared)
    guard let initVal = mirror.children.first(where: { $0.label == "initResponse" })?.value else {
      return nil
    }
    let r2 = Mirror(reflecting: initVal)
    guard let adslotsAny = r2.children.first(where: { $0.label == "adslots" })?.value as? [Any] else {
      return nil
    }
    for slot in adslotsAny {
      let sm = Mirror(reflecting: slot)
      var id: Int?
      var slotName: String?
      var type: String?
      for c in sm.children {
        switch c.label {
        case "id": id = c.value as? Int
        case "name": slotName = c.value as? String
        case "type": type = c.value as? String
        default: break
        }
      }
      if type == "offerwall", slotName == name {
        return id
      }
    }
    return nil
  }
}
