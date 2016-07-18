/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  helporz
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application    didFinishLaunchingWithOptions:(NSDictionary*)launchOptions{ 
 	//------------------------------JMessage start----------------------------------- 
    _jmessage = [JMessageHelper new]; 
    [_jmessage initJMessage:launchOptions]; 
    //------------------------------JMessage end----------------------------------- 
 	//------------------------------JMessage start----------------------------------- 
    
//JMessage remove code mark; 
    
//JMessage remove code mark; 
    //------------------------------JMessage end----------------------------------- 
 	//------------------------------JMessage start----------------------------------- 
    
//JMessage remove code mark; 
    
//JMessage remove code mark; 
    //------------------------------JMessage end-----------------------------------
    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken { 
    [JPUSHService registerDeviceToken:deviceToken]; 

//JMessage remove code mark; 

//JMessage remove code mark; 
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo { 
    [JPUSHService handleRemoteNotification:userInfo]; 

//JMessage remove code mark; 

//JMessage remove code mark; 
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler { 
    [_jmessage didReceiveRemoteNotification:userInfo];
//JMessage remove code mark;
//JMessage remove code mark; 
}
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification { 
    [JPUSHService showLocalNotificationAtFront:notification identifierKey:nil]; 

//JMessage remove code mark; 

//JMessage remove code mark; 
}
@end

@implementation NSURLRequest(DataController)
+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
{
    return YES;
}
@end
