//
//  VoipManager.h
//  futureof
//
//  Created by StarDev on 12/3/20.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNVoipPushNotificationManager : RCTEventEmitter <RCTBridgeModule>

typedef void (^RNVoipPushNotificationCompletion)(void);

@property (nonatomic, strong) NSMutableDictionary<NSString *, RNVoipPushNotificationCompletion> *completionHandlers;

+ (void)voipRegistration;
+ (void)didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type;
+ (void)didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type;
+ (void)addCompletionHandler:(NSString *)uuid completionHandler:(RNVoipPushNotificationCompletion)completionHandler;
+ (void)removeCompletionHandler:(NSString *)uuid;

@end
