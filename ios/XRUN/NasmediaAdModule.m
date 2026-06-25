#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NasmediaAdModule, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)mediaKey
                  adUnitIds:(NSArray *)adUnitIds
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loadAndShowRewardedAd:(NSString *)adUnitId
                  memberId:(nonnull NSNumber *)memberId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
