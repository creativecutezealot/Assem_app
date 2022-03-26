//
//  FOAVRoutePickerManager.m
//  futureof
//
//  Created by StarDev on 3/20/21.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVAudioSession.h>
#import <AVKit/AVRoutePickerView.h>
#import "MediaPlayer/MPVolumeView.h"
#import <React/RCTViewManager.h>
#import "FOAVRoutePickerView.h"
#import "FOMPVolumeView.h"

@interface FOAVRoutePickerManager : RCTViewManager <AVRoutePickerViewDelegate>
- (void) routePickerViewDidEndPresentingRoutes:(AVRoutePickerView *)routePickerView API_AVAILABLE(ios(11.0));
@end

@implementation FOAVRoutePickerManager

RCT_EXPORT_MODULE(FOAVRoutePicker)

- (UIView *)view
{
  FOAVRoutePickerView *picker = [FOAVRoutePickerView new];
  picker.delegate = self;
  picker.activeTintColor = UIColor.clearColor;
  picker.tintColor = UIColor.clearColor;
  picker.delegate = self;
  return  picker;
}

- (void)routePickerViewDidEndPresentingRoutes:(AVRoutePickerView *)routePickerView {
  AVAudioSession *session = [AVAudioSession sharedInstance];
  NSArray *outputs = [[session currentRoute] outputs];
  for (AVAudioSessionPortDescription* portDesc in outputs)
  {
    NSLog(@"-----");
    NSLog(@"portDesc UID %@", portDesc.UID);
    NSLog(@"portDesc portName %@", portDesc.portName);
    NSLog(@"portDesc portType %@", portDesc.portType);
    NSLog(@"portDesc channels %@", portDesc.channels);
  }
}

@end
