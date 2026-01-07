import sys
import os

file_path = '/Users/weeinhwa/dev/eXrunApplication/ios/XRUN/AppDelegate.swift'

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    sys.exit(1)

with open(file_path, 'r') as f:
    lines = f.readlines()

content = "".join(lines)

# 1. Update App ID
if 'config.appID = "8025677"' in content:
    content = content.replace('config.appID = "8025677"', 'config.appID = "8747761"')
    print("Updated App ID")

lines = content.splitlines(keepends=True)

# 2. Add Properties
# Check if properties already exist to avoid duplicates
has_properties = any('private var currentAppOpenAd: PAGLAppOpenAd?' in line for line in lines)
if not has_properties:
    for i, line in enumerate(lines):
        if 'public class AppDelegate: ExpoAppDelegate {' in line:
            lines.insert(i + 1, '  private var currentAppOpenAd: PAGLAppOpenAd?\n')
            lines.insert(i + 2, '  private var isAdShowing = false\n')
            print("Added properties")
            break

# 3. Call load in setupPangleSDK
# Check if call already exists
has_load_call = any('loadAndShowAppOpenAd(slotId: "890124752")' in line for line in lines)
if not has_load_call:
    for i, line in enumerate(lines):
        if 'config.debugLog = true' in line:
            # Insert after debugLog line
            lines.insert(i + 1, '    self.loadAndShowAppOpenAd(slotId: "890124752")\n')
            print("Added load call in setupPangleSDK")
            break

# 4. Add loadAndShowAppOpenAd method
# Check if method already exists
has_method = any('func loadAndShowAppOpenAd' in line for line in lines)
if not has_method:
    # Insert before findVisibleViewController
    for i, line in enumerate(lines):
        if 'private func findVisibleViewController() -> UIViewController?' in line:
            methods = [
                '\n',
                '  // 앱 오프닝 광고 로드 및 노출\n',
                '  @objc public func loadAndShowAppOpenAd(slotId: String) {\n',
                '    if isAdShowing { return }\n',
                '    \n',
                '    print("[AppDelegate] 앱 오프닝 광고 로드 시도 (SlotID: \\(slotId))")\n',
                '    let request = PAGAppOpenRequest()\n',
                '    PAGLAppOpenAd.load(withSlotID: slotId, request: request) { [weak self] ad, error in\n',
                '      if let error = error {\n',
                '        print("[AppDelegate] ❌ 앱 오프닝 광고 로드 실패: \\(error.localizedDescription)")\n',
                '        return\n',
                '      }\n',
                '      \n',
                '      self?.currentAppOpenAd = ad\n',
                '      self?.currentAppOpenAd?.delegate = self\n',
                '      \n',
                '      DispatchQueue.main.async {\n',
                '        guard let self = self, let visibleVC = self.findVisibleViewController(), !self.isAdShowing else {\n',
                '          return\n',
                '        }\n',
                '        \n',
                '        print("[AppDelegate] 앱 오프닝 광고 노출")\n',
                '        ad?.present(fromRootViewController: visibleVC)\n',
                '      }\n',
                '    }\n',
                '  }\n',
                '  \n',
                '  public override func applicationDidBecomeActive(_ application: UIApplication) {\n',
                '    super.applicationDidBecomeActive(application)\n',
                '    // 앱이 포그라운드로 올 때 필요 시 광고 노출 (옵션)\n',
                '    // loadAndShowAppOpenAd(slotId: "890124752")\n',
                '  }\n'
            ]
            lines[i:i] = methods
            print("Added loadAndShowAppOpenAd method")
            break

# 5. Update Delegate Extension
# Check if PAGLAppOpenAdDelegate is already added
has_delegate = any('PAGLAppOpenAdDelegate' in line for line in lines)
if not has_delegate:
    for i, line in enumerate(lines):
        if 'extension AppDelegate: PAGLInterstitialAdDelegate {' in line:
            lines[i] = 'extension AppDelegate: PAGLInterstitialAdDelegate, PAGLAppOpenAdDelegate {\n'
            print("Updated extension conformance")
            break

# Update adDidShow
is_ad_did_show_updated = False
for i, line in enumerate(lines):
    if 'public func adDidShow(_ ad: PAGAdProtocol) {' in line:
        if 'if ad is PAGLAppOpenAd' not in lines[i+1]:
             lines.insert(i + 1, '    if ad is PAGLAppOpenAd { self.isAdShowing = true }\n')
             is_ad_did_show_updated = True
             print("Updated adDidShow")
        break

# Update adDidDismiss
is_ad_did_dismiss_updated = False
for i, line in enumerate(lines):
    if 'public func adDidDismiss(_ ad: PAGAdProtocol) {' in line:
        # Check if logic already exists
        has_logic = False
        for j in range(i, min(i+10, len(lines))):
             if 'if ad is PAGLAppOpenAd' in lines[j]:
                 has_logic = True
                 break
        
        if not has_logic:
            lines.insert(i + 1, '    if ad is PAGLAppOpenAd {\n')
            lines.insert(i + 2, '        self.isAdShowing = false\n')
            lines.insert(i + 3, '        self.currentAppOpenAd = nil\n')
            lines.insert(i + 4, '    }\n')
            is_ad_did_dismiss_updated = True
            print("Updated adDidDismiss")
        break

with open(file_path, 'w') as f:
    f.writelines(lines)
