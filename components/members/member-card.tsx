import { Member } from "@/lib/api"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash } from "lucide-react"

interface MemberCardProps {
  member: Member
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}

export function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0 flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {getInitials(member.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium text-lg">{member.full_name}</h3>
          <p className="text-sm text-muted-foreground">{member.position}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-center">
        <Badge variant="outline" className="mb-2">
          {member.division}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(member)}>
          <Trash className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </CardFooter>
    </Card>
  )
}
