import UIKit
import WebKit
import Foundation

enum XRUNAyetOfferwallPresenter {
  @MainActor
  static func present(url: URL, userAgent: String?) {
    NSLog("[ayeT] XRUNPresenter.present 호출 url=%{public}@", url.absoluteString)
    guard let host = topPresenter() else {
      NSLog("[ayeT] ❌ topPresenter() nil — 오퍼월 표시 불가. window/scene 구조 확인 필요")
      return
    }
    NSLog("[ayeT] topPresenter found: %{public}@", String(describing: type(of: host)))
    let vc = XRUNAyetOfferwallHostViewController(url: url, userAgent: userAgent)
    vc.modalPresentationStyle = .fullScreen
    host.present(vc, animated: true) {
      NSLog("[ayeT] ✅ offerwall VC present 완료")
    }
  }

  @MainActor
  private static func topPresenter() -> UIViewController? {
    if let appDelegate = UIApplication.shared.delegate as? AppDelegate,
       let root = appDelegate.window?.rootViewController {
      return topMost(from: root)
    }
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    for scene in scenes where scene.activationState == .foregroundActive {
      if let r = scene.windows.first(where: { $0.isKeyWindow })?.rootViewController {
        return topMost(from: r)
      }
    }
    for scene in scenes {
      if let r = scene.windows.first?.rootViewController {
        return topMost(from: r)
      }
    }
    return nil
  }

  @MainActor
  private static func topMost(from root: UIViewController) -> UIViewController {
    var top = root
    while let p = top.presentedViewController {
      top = p
    }
    return top
  }
}

@MainActor
private final class XRUNAyetOfferwallHostViewController: UIViewController, WKNavigationDelegate {
  private let requestUrl: URL
  private let customUserAgent: String?
  private var webView: WKWebView!

  init(url: URL, userAgent: String?) {
    self.requestUrl = url
    self.customUserAgent = userAgent
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    NSLog("[ayeT] HostVC viewDidLoad — loading url=%{public}@", requestUrl.absoluteString)
    view.backgroundColor = .systemBackground

    let closeBtn = UIButton(type: .system)
    closeBtn.setTitle("닫기", for: .normal)
    closeBtn.titleLabel?.font = .systemFont(ofSize: 17, weight: .semibold)
    closeBtn.translatesAutoresizingMaskIntoConstraints = false
    closeBtn.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
    view.addSubview(closeBtn)

    let cfg = WKWebViewConfiguration()
    cfg.defaultWebpagePreferences.allowsContentJavaScript = true
    webView = WKWebView(frame: .zero, configuration: cfg)
    webView.navigationDelegate = self
    webView.translatesAutoresizingMaskIntoConstraints = false
    if let ua = customUserAgent, !ua.isEmpty {
      webView.customUserAgent = ua
    }
    view.addSubview(webView)

    NSLayoutConstraint.activate([
      closeBtn.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 10),
      closeBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
      webView.topAnchor.constraint(equalTo: closeBtn.bottomAnchor, constant: 8),
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])

    webView.load(URLRequest(url: requestUrl))
  }

  @objc private func closeTapped() {
    NSLog("[ayeT] 사용자가 닫기 버튼 탭")
    dismiss(animated: true)
  }

  nonisolated func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
    NSLog("[ayeT] WebView didStartProvisionalNavigation url=%{public}@", webView.url?.absoluteString ?? "(nil)")
  }
  nonisolated func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    NSLog("[ayeT] ✅ WebView didFinish url=%{public}@ title=%{public}@", webView.url?.absoluteString ?? "(nil)", webView.title ?? "(no title)")
  }
  nonisolated func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    NSLog("[ayeT] ❌ WebView didFail error=%{public}@", error.localizedDescription)
  }
  nonisolated func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    NSLog("[ayeT] ❌ WebView didFailProvisionalNavigation error=%{public}@", error.localizedDescription)
  }

  func webView(
    _ webView: WKWebView,
    decidePolicyFor navigationAction: WKNavigationAction,
    decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
  ) {
    guard let url = navigationAction.request.url else {
      decisionHandler(.allow); return
    }
    let scheme = url.scheme?.lowercased() ?? ""
    NSLog("[ayeT] decidePolicyFor url=%{public}@ scheme=%{public}@", url.absoluteString, scheme)

    let externalSchemes: Set<String> = [
      "itms-apps", "itms-appss",
      "tel", "sms", "mailto", "facetime", "facetime-audio",
      "intent",  
    ]

    if externalSchemes.contains(scheme) {
      NSLog("[ayeT] 외부 스킴 감지 → UIApplication.open")
      UIApplication.shared.open(url, options: [:]) { ok in
        NSLog("[ayeT] UIApplication.open 결과 %{public}d url=%{public}@", ok ? 1 : 0, url.absoluteString)
      }
      decisionHandler(.cancel)
      return
    }

    if scheme == "https" || scheme == "http" {
      let host = url.host?.lowercased() ?? ""
      if host == "apps.apple.com" || host == "itunes.apple.com" {
        NSLog("[ayeT] apps.apple.com 링크 → UIApplication.open")
        UIApplication.shared.open(url, options: [:]) { ok in
          NSLog("[ayeT] App Store open 결과 %{public}d", ok ? 1 : 0)
        }
        decisionHandler(.cancel)
        return
      }
    }

    decisionHandler(.allow)
  }
}
