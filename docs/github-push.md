# GitHub Push（SotaroCraft / このリポジトリのみ）

他プロジェクトは既定の GitHub アカウント（例: `sotarosan`）のまま、**MicroBootCan だけ** `SotaroCraft` で push する設定。

## 仕組み

SSH の **Host 別名** `github-sotarocraft` を使い、専用鍵だけをこのリポジトリの remote に紐付ける。

```
他プロジェクト  →  github.com          →  既定アカウント
MicroBootCan    →  github-sotarocraft  →  SotaroCraft 専用鍵
```

## セットアップ（1 回）

```powershell
cd c:\Users\seq\apps\MicroBootCan
.\infra\scripts\setup-github-sotarocraft.ps1
```

スクリプトが行うこと:

1. `~/.ssh/id_ed25519_sotarocraft` を作成（なければ）
2. `~/.ssh/config` に `Host github-sotarocraft` を追加
3. **この repo のみ** `git config --local` で user.name / user.email / remote URL を設定

## GitHub 側

1. スクリプト表示の **公開鍵** をコピー
2. [SotaroCraft → Settings → SSH keys](https://github.com/settings/keys) で **New SSH key** を登録

## 動作確認

```powershell
ssh -T github-sotarocraft
# Hi SotaroCraft! You've successfully authenticated...

cd c:\Users\seq\apps\MicroBootCan
git push -u origin main
```

## トラブルシュート

| 症状 | 対処 |
|------|------|
| `Permission denied (sotarosan)` | remote が HTTPS のまま。スクリプト再実行 |
| `Permission denied (publickey)` | 公開鍵を SotaroCraft に未登録 |
| 他 repo まで SotaroCraft になる | remote URL に `github-sotarocraft` が入っていないか確認 |

## HTTPS を使う場合（代替）

SSH 不要なら、この repo のみ:

```powershell
git config --local credential.https://github.com.useHttpPath true
```

初回 `git push` 時に **SotaroCraft** の PAT でログイン（Credential Manager がパス単位で保存）。
