#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <PushKit/PushKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, PKPushRegistryDelegate,  RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
