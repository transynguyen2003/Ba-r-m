import { useCallback, useEffect, useState } from 'react';
import {
  getAdminSiteAssets,
  updateAdminSiteAssetFile,
  updateAdminSiteAssetMeta,
} from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { getImageFileFromClipboardEvent } from '../../utils/clipboardImage.js';

const KEY_LABELS = {
  home_hero_image: 'Hero trang chủ (ảnh nền)',
  product_list_hero_image: 'Hero trang danh sách sản phẩm',
  product_list_empty_image: 'Ảnh khi danh sách trống',
  product_detail_fallback_image: 'Ảnh fallback chi tiết SP',
  product_detail_cta_image: 'Ảnh CTA cuối trang chi tiết',
};

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export default function AdminSiteAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');
  const [pasteTargetId, setPasteTargetId] = useState(null);
  const [pasteHint, setPasteHint] = useState('');

  const load = () => {
    setLoading(true);
    getAdminSiteAssets()
      .then((list) => {
        setAssets(list);
        setPasteTargetId((prev) => prev ?? list[0]?.id ?? null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const saveMeta = async (asset, fields) => {
    setSavingId(asset.id);
    setMessage('');
    try {
      await updateAdminSiteAssetMeta(asset.id, fields);
      setMessage(`Đã lưu: ${KEY_LABELS[asset.key] ?? asset.key}`);
      load();
    } catch {
      setMessage('Lưu thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  const handleImage = useCallback(async (asset, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setSavingId(asset.id);
    setMessage('');
    try {
      await updateAdminSiteAssetFile(asset.id, fd);
      setMessage(`Đã cập nhật ảnh: ${KEY_LABELS[asset.key] ?? asset.key}`);
      load();
    } catch {
      setMessage('Upload ảnh thất bại.');
      throw new Error('upload failed');
    } finally {
      setSavingId(null);
    }
  }, []);

  useEffect(() => {
    const onPaste = async (event) => {
      if (!pasteTargetId) return;

      const asset = assets.find((a) => a.id === pasteTargetId);
      if (!asset) return;

      const file = getImageFileFromClipboardEvent(event);
      if (!file) return;

      event.preventDefault();
      setPasteHint('Đang dán ảnh từ clipboard...');
      try {
        await handleImage(asset, file);
        setPasteHint(`Đã dán ảnh cho: ${KEY_LABELS[asset.key] ?? asset.key}`);
      } catch {
        setPasteHint('Dán ảnh thất bại. Thử lại hoặc chọn file.');
      } finally {
        setTimeout(() => setPasteHint(''), 3000);
      }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [pasteTargetId, assets, handleImage]);

  const ordered = [...assets].sort((a, b) => {
    const keys = Object.keys(KEY_LABELS);
    return keys.indexOf(a.key) - keys.indexOf(b.key);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ảnh giao diện website</h1>
        <p className="mt-1 text-slate-500">
          Thay đổi ảnh hero trang chủ và các ảnh trên trang sản phẩm công khai. Chọn khung ảnh
          bên dưới rồi <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Ctrl+V</kbd> để
          dán ảnh từ clipboard.
        </p>
      </div>

      {(message || pasteHint) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {pasteHint || message}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {ordered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              label={KEY_LABELS[asset.key] ?? asset.key}
              saving={savingId === asset.id}
              isPasteTarget={pasteTargetId === asset.id}
              onActivate={() => setPasteTargetId(asset.id)}
              onSaveMeta={saveMeta}
              onImage={handleImage}
              inputClass={inputClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetCard({
  asset,
  label,
  saving,
  isPasteTarget,
  onActivate,
  onSaveMeta,
  onImage,
  inputClass,
}) {
  const [title, setTitle] = useState(asset.title);
  const [description, setDescription] = useState(asset.description ?? '');
  const [isActive, setIsActive] = useState(asset.is_active);

  useEffect(() => {
    setTitle(asset.title);
    setDescription(asset.description ?? '');
    setIsActive(asset.is_active);
  }, [asset]);

  const handleLocalPaste = async (event) => {
    const file = getImageFileFromClipboardEvent(event);
    if (!file) return;
    event.preventDefault();
    onActivate();
    await onImage(asset, file);
  };

  return (
    <article
      tabIndex={0}
      onFocus={onActivate}
      onClick={onActivate}
      onPaste={handleLocalPaste}
      className={`rounded-2xl border bg-white p-6 shadow-sm outline-none transition ${
        isPasteTarget
          ? 'border-amber-400 ring-2 ring-amber-200'
          : 'border-slate-200 hover:border-amber-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-amber-700">{asset.key}</p>
          <h2 className="mt-1 font-semibold text-slate-900">{label}</h2>
        </div>
        {isPasteTarget && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Đang chọn để dán
          </span>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
        {asset.url ? (
          <img src={asset.url} alt={asset.title} className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center text-slate-400">Chưa có ảnh</div>
        )}
      </div>

      <label
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-3 text-sm transition ${
          isPasteTarget
            ? 'border-amber-400 bg-amber-50/50 text-amber-800'
            : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{saving ? 'Đang tải...' : 'Chọn ảnh mới'}</span>
        <span className="mt-1 text-xs opacity-80">hoặc click khung này rồi Ctrl+V</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={saving}
          onChange={(e) => onImage(asset, e.target.files?.[0])}
        />
      </label>

      <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div>
          <label className="mb-1 block text-sm text-slate-600">Tiêu đề</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600">Mô tả</label>
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Hiển thị trên website
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSaveMeta(asset, { title, description, is_active: isActive })}
          className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          Lưu thông tin
        </button>
      </div>
    </article>
  );
}
