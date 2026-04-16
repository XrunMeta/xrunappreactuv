#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AdisonModule, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)appKey
                  server:(NSString *)server
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setConfig:(NSString *)offerwallTitle
                  listType:(NSString *)listType
                  themeMode:(NSString *)themeMode)

RCT_EXTERN_METHOD(setUid:(NSString *)uid)

RCT_EXTERN_METHOD(unsetUid)

RCT_EXTERN_METHOD(setTargeting:(nonnull NSNumber *)birthYear
                  gender:(NSString *)gender)

RCT_EXTERN_METHOD(showOfferwall:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showOfferwallAd:(nonnull NSNumber *)adId
                  keepParent:(BOOL)keepParent
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
