// pages/terms.tsx
export default function TermsPage() {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">利用規約</h1>
        <p className="mb-4">
          本サービスをご利用いただくにあたり、以下の利用規約に同意していただく必要があります。
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>ユーザーは著作権を侵害する音源をアップロードしてはなりません。</li>
          <li>本サービス上での嫌がらせ、スパム行為は禁止されています。</li>
          <li>運営は事前通知なくサービスを変更・停止できるものとします。</li>
          <li>違反行為が認められた場合、アカウントを停止または削除する場合があります。</li>
          <li>その他、運営が不適切と判断した行為は禁止されます。</li>
        </ol>
      </div>
    );
  }
  