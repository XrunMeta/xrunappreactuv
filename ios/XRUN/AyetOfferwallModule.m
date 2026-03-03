#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AyetOfferwallModule, NSObject)

RCT_EXTERN_METHOD(setUserId:(NSString *)userId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showOfferwall:(NSString *)adSlotName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getOffers:(NSString *)adSlotName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
