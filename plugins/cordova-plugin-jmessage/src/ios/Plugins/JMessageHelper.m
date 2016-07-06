//	            __    __                ________
//	| |    | |  \ \  / /  | |    | |   / _______|
//	| |____| |   \ \/ /   | |____| |  / /
//	| |____| |    \  /    | |____| |  | |   _____
//	| |    | |    /  \    | |    | |  | |  |____ |
//  | |    | |   / /\ \   | |    | |  \ \______| |
//  | |    | |  /_/  \_\  | |    | |   \_________|
//
//	Copyright (c) 2012年 HXHG. All rights reserved.
//	http://www.jpush.cn
//  Created by liangjianguo
//


#import "JMessageHelper.h"
#import "ConstantDef.h"


@implementation JMessageHelper

-(void)initJMessage:(NSDictionary*)launchOptions
{
  //read appkey and channel from JMessageConfig.plist
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:JMessageConfigFileName ofType:@"plist"];
  if (plistPath == nil) {
    NSLog(@"error: JMessageConfig.plist ");
    assert(0);
  }
  
  NSMutableDictionary *plistData = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
  NSString * appkey = [plistData valueForKey:JM_APP_KEY];
  NSString * channel = [plistData valueForKey:JM_APP_CHANNEL];
  if (!appkey || appkey.length == 0) {
    NSLog(@"error: app key not found in JMessageConfig.plist ");
    assert(0);
  }
  // init third-party SDK
  [JMessage addDelegate:self withConversation:nil];
  [JMessage setupJMessage:launchOptions
                   appKey:appkey
                  channel:channel apsForProduction:NO
                 category:nil];
  [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                    UIUserNotificationTypeSound |
                                                    UIUserNotificationTypeAlert)
                                        categories:nil];
  
  [self registerJPushStatusNotification];
}



- (void)registerJPushStatusNotification {
  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  
  [defaultCenter addObserver:self
                    selector:@selector(receivePushMessage:)
                        name:kJPFNetworkDidReceiveMessageNotification
                      object:nil];
  
}


// notification from JPush
- (void)receivePushMessage:(NSNotification *)notification {
  NSLog(@"Event - receivePushMessage");
  
  NSDictionary *info = notification.userInfo;
  if (info) {
    NSLog(@"The message - %@", info);
  } else {
    NSLog(@"Unexpected - no user info in jpush mesasge");
  }
  [[NSNotificationCenter defaultCenter] postNotificationName:kJJPushReceiveMessage
                                                      object:info];
  
}




- (void)onReceiveMessage:(JMSGMessage *)message
                   error:(NSError *)error;
{
  NSString * jsonString =  [message toJsonString];
  NSLog(@"onReceiveMessage");
  NSMutableDictionary * dict = [NSMutableDictionary new];
  [dict setValue:jsonString forKey:KEY_CONTENT];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJJMessageReceiveMessage
                                                      object:dict];
}


- (void)onSendMessageResponse:(JMSGMessage *)message
                        error:(NSError *)error
{
  NSLog(@"onSendMessageResponse");
  NSMutableDictionary * dict = [NSMutableDictionary new];
  [dict setValue:message.msgId forKey:KEY_MSGID];
  
  if (error == nil) {
    [dict setValue:@"send message sucess" forKey:KEY_RESPONE];
  }else{
    [dict setValue:@"send message fail" forKey:KEY_RESPONE];
    [dict setValue:[NSNumber numberWithLong:error.code] forKey:KEY_ERRORCODE];
    [dict setValue:error.description forKey:KEY_ERRORDESCRIP];
  }
  [[NSNotificationCenter defaultCenter] postNotificationName:kJJMessageSendSingleMessageRespone
                                                      object:dict];
}


- (void)onReceiveMessageDownloadFailed:(JMSGMessage *)message
{
  NSLog(@"onReceiveMessageDownloadFailed");
}


- (void)onConversationChanged:(JMSGConversation *)conversation
{
  NSLog(@"onConversationChanged");
  
  NSMutableDictionary * dict = [NSMutableDictionary new];
  
  JMSGUser *user = conversation.target;
  int nGender = (int) user.gender;
  
  [dict setValue:user.username forKey:KEY_TARGETID];
  [dict setValue:user.nickname  forKey:KEY_NICKNAME];
  [dict setValue:user.avatar forKey:KEY_AVATAR];
  [dict setValue:[NSNumber numberWithInt:nGender] forKey:KEY_GENDER];
  
  [dict setValue:conversation.latestMessageContentText forKey:KEY_LASTMESSAGE];
  [dict setValue:conversation.unreadCount forKey:KEY_UNREADCOUNT];
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kJJMessageConversationChange
                                                      object:dict];
  
}


- (void)onUnreadChanged:(NSUInteger)newCount
{
  NSLog(@"onUnreadChanged");
}


- (void)didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  NSLog(@"收到通知:%@", [self logDic:userInfo]);
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJJPushReceiveNotification
                                                      object:userInfo];
}


// log NSSet with UTF8
// if not ,log will be \Uxxx
- (NSString *)logDic:(NSDictionary *)dic {
  if (![dic count]) {
    return nil;
  }
  NSString *tempStr1 =
  [[dic description] stringByReplacingOccurrencesOfString:@"\\u"
                                               withString:@"\\U"];
  NSString *tempStr2 =
  [tempStr1 stringByReplacingOccurrencesOfString:@"\"" withString:@"\\\""];
  NSString *tempStr3 =
  [[@"\"" stringByAppendingString:tempStr2] stringByAppendingString:@"\""];
  NSData *tempData = [tempStr3 dataUsingEncoding:NSUTF8StringEncoding];
  NSString *str =
  [NSPropertyListSerialization propertyListFromData:tempData
                                   mutabilityOption:NSPropertyListImmutable
                                             format:NULL
                                   errorDescription:NULL];
  return str;
}


@end
