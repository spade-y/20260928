export async function onRequestPost(context) {
	console.error('1');
  try {
	  console.error('2');
    // 1. 解析请求体
    const { name, phone, count, message } = await context.request.json();

    // 2. 基本验证
    if (!name || !phone || !count) {
      return new Response(JSON.stringify({ error: '缺少必要字段' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. 获取 D1 数据库绑定
    const db = context.env.DB;
    
    // 4. 执行插入操作
    // 注意：确保你的 D1 数据库中已经创建了 rsvps 表
    const stmt = db.prepare(
      `INSERT INTO rsvps (name, phone, guest_count, message, created_at) VALUES (?, ?, ?, ?, datetime('now'))`
    );
    
    await stmt.bind(name, phone, count, message || '').run();

    // 5. 返回成功响应
    return new Response(JSON.stringify({ success: true, message: '回执提交成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
	  console.error('3');
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: '内部服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
