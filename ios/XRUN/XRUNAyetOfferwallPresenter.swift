import UIKit
import WebKit

enum XRUNAyetOfferwallPresenter {
  @MainActor
  static func present(url: URL, userAgent: String?) {
    guard let host = topPresenter() else {
      NSLog("[ayeT] XRUN: topPresenter() nil — cannot show offerwall")
      return
    }
    let vc = XRUNAyetOfferwallHostViewController(url: url, userAgent: userAgent)
    vc.modalPresentationStyle = .fullScreen
    host.present(vc, animated: true)
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
private final class XRUNAyetOfferwallHostViewController: UIViewController {
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
    dismiss(animated: true)
  }
}
