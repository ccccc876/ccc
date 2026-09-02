// api/github-webhook.js
const { getToken } = require('@vercel/connect');

module.exports = async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    // 1. 接收 GitHub 推送的事件数据
    const payload = req.body;
    console.log('=== 收到GitHub Webhook事件 ===');
    console.log('事件类型:', req.headers['x-github-event']);
    console.log('仓库:', payload.repository?.full_name);
    console.log('提交人:', payload.pusher?.name);

    // 2. 获取 GitHub 访问令牌（UID 固定为 github/gta-vehicles）
    const tokenResult = await getToken('github/gta-vehicles', {
      subject: { type: 'installation' }
    });
    console.log('=== 拿到GitHub访问Token ===');
    console.log('Token前缀:', tokenResult.token?.substring(0, 20) + '...');

    // 3. 返回成功
    return res.status(200).json({ success: true, message: '事件接收完成' });

  } catch (error) {
    console.error('处理失败:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
