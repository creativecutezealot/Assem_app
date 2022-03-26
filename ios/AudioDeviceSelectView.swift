//
//  AudioDeviceSelectView.swift
//  futureof
//
//  Created by StarDev on 10/21/20.
//

import UIKit
import Foundation
import AVFoundation
import SoundAnalysis

@objc
class AudioDeviceSelectView: UIView {
    // ------------------------------------------------
    // MARK: - - View Lifecycle
    // ------------------------------------------------
    let audioSession = AVAudioSession.sharedInstance()  
 
    @objc
    init() {
        super.init(frame: .zero)
        commonInit()
    }
  
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    private func commonInit() {
    }
    
    override func didMoveToSuperview() {
        print("Did move to superview\n")
    }

    deinit {
        print("deinit PanModalView")
    }
    
    // ------------------------------------------------
    // MARK: - Public APIs
    // ------------------------------------------------
  
    @objc
    func presentActionSheet() {
      do {
        try audioSession.setCategory(AVAudioSession.Category.playAndRecord,
                                mode: AVAudioSession.Mode.videoChat,
                                options: [.allowBluetooth, .allowAirPlay, .allowBluetoothA2DP])
        } catch let error as NSError {
            print("Failed to set the audio session category and mode: \(error.localizedDescription)")
        }
      audioSession.ChangeAudioOutputWithPhone((window?.rootViewController)!)
    }
}

