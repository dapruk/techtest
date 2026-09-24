import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export default function Index() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <Card className="w-[25vw]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label>Username</Label>
          <Input type="text" placeholder="Username" />
          <Label>Password</Label>
          <Input type="password" placeholder="Password" />
        </CardContent>
        <CardFooter>
          <Button className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
