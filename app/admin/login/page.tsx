import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-bold">后台登录</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        用 Supabase 创建的管理员账号登录
      </p>

      <form action={login} className="mt-8 flex flex-col gap-4">
        <Input name="email" type="email" required placeholder="邮箱" />
        <Input name="password" type="password" required placeholder="密码" />
        {error ? (
          <p className="text-sm text-destructive">邮箱或密码错误</p>
        ) : null}
        <Button type="submit">登录</Button>
      </form>
    </div>
  );
}