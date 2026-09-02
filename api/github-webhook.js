module.exports = (req, res) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 获取 GitHub 事件类型
  const eventType = req.headers['x-github-event'];
  
  try {
    // 处理 GitHub 添加 Webhook 时的 ping 测试
    if (eventType === 'ping') {
      console.log('收到 GitHub ping 事件，Webhook 连接正常');
      return res.status(200).json({
        message: 'pong',
        status: 'success'
      });
    }

    // 处理代码推送事件
    if (eventType === 'push') {
      const payload = req.body;
      const commitInfo = payload.head_commit || {};
      console.log(`收到推送事件：提交者 ${commitInfo.author?.name}，提交信息：${commitInfo.message}`);
      
      // 这里可以添加你的自定义逻辑，比如触发通知、同步数据等
      return res.status(200).json({
        message: 'Push event received',
        status: 'success',
        commit: commitInfo.id
      });
    }

    // 其他事件统一返回
    return res.status(200).json({
      message: `Event ${eventType} received`,
      status: 'success'
    });

  } catch (error) {
    console.error('Webhook 处理出错：', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

