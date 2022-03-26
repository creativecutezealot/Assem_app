//
//  AudioDeviceSelect.m
//  futureof
//
//  Created by StarDev on 10/21/20.
//
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

#import "AudioDeviceSelect.h"
#import "FutureOf-Swift.h"

@implementation AudioDeviceSelect

RCT_EXPORT_MODULE(AudioDeviceSelect)

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (UIView *)view
{
    return [[AudioDeviceSelectView alloc] init];
}

RCT_EXPORT_METHOD(presentActionSheet:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        AudioDeviceSelectView *audioDeviceSelectView = viewRegistry[reactTag];
        if (!audioDeviceSelectView || ![audioDeviceSelectView isKindOfClass:[AudioDeviceSelectView class]]) {
            RCTLogError(@"Cannot find PanModal with tag #%@", reactTag);
            return;
        }
        [audioDeviceSelectView presentActionSheet];
    }];
}
@end

