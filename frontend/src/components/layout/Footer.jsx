import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-lg font-bold text-white">Bán Rèm</p>
          <p className="mt-2 text-sm leading-relaxed">
            Chuyên cung cấp rèm cửa chất lượng cho gia đình và văn phòng.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Liên kết</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">Sản phẩm</Link></li>
            <li><Link to="/blog" className="hover:text-white">Tin tức</Link></li>
            <li><Link to="/order" className="hover:text-white">Đặt hàng / Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Hotline: 0900 000 000</li>
            <li>Email: hello@banrem.test</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bán Rèm. All rights reserved.
      </div>
    </footer>
  );
}
