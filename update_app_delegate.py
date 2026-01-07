import sys

file_path = '/Users/weeinhwa/dev/eXrunApplication/ios/XRUN/AppDelegate.swift'
with open(file_path, 'r') as f:
    lines = f.readlines()

# 1. Properties
for i, line in enumerate(lines):
    if 'private var currentInterstitialAd: PAGLInterstitialAd?' in line:
        lines.insert(i + 1, '  private var currentAppOpenAd: PAGLAppOpenAd?\n')
        lines.insert(i + 2, '  private var isAdShowing = false\n')
        break

# 2. Call load in didFinishLaunching
for i, line in enumerate(lines):
    if 'setupPangleSDK()' in line:
        lines.insert(i + 1, '    loadAndShowAppOpenAd(slotId: "890124752")\n')
        break

# 3. Add app open ad methods
insert_pos = -1
for i, line in enumerate(lines):
    if 'private func findVisibleViewController() -> UIViewController?' in line:
        insert_pos = i
        break

if insert_pos != -1:
    methods = [
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
        '  }\n',
        '\n'
    ]
    lines[insert_pos:insert_pos] = methods

# 4. Implement PAGLAppOpenAdDelegate in the extension
for i, line in enumerate(lines):
    if 'extension AppDelegate: PAGLInterstitialAdDelegate {' in line:
        lines[i] = 'extension AppDelegate: PAGLInterstitialAdDelegate, PAGLAppOpenAdDelegate {\n'
        break

# Add adDidShow for AppOpenAd
for i, line in enumerate(lines):
    if 'public func adDidShow(_ ad: PAGAdProtocol) {' in line:
        lines.insert(i + 1, '    if ad is PAGLAppOpenAd { self.isAdShowing = true }\n')
        break

# Update adDidDismiss for AppOpenAd
for i, line in enumerate(lines):
    if 'public func adDidDismiss(_ ad: PAGAdProtocol) {' in line:
        lines.insert(i + 1, '    if ad is PAGLAppOpenAd {\n')
        lines.insert(i + 2, '        self.isAdShowing = false\n')
        lines.insert(i + 3, '        self.currentAppOpenAd = nil\n')
        lines.insert(i + 4, '    }\n')
        break

with open(file_path, 'w') as f:
    f.writelines(lines)
