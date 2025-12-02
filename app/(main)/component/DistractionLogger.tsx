"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import { Smartphone, Globe, Volume2, Users, Coffee, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const COMMON_DISTRACTIONS = [
  { type: "phone", icon: Smartphone, label: "Phone" },
  { type: "social-media", icon: Globe, label: "Social Media" },
  { type: "noise", icon: Volume2, label: "Noise" },
  { type: "people", icon: Users, label: "People" },
  { type: "break", icon: Coffee, label: "Break" },
]

type Props = {
  sessionId: string
  onComplete: () => void
}

export function DistractionLogger({ sessionId, onComplete }: Props) {
  const [distractions, setDistractions] = useState([])
  const [customType, setCustomType] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  const addDistraction = (type: string) => {
    setDistractions([
      ...distractions,
      { type, duration: 5, intensity: "medium", notes: "" },
    ])
    setShowCustom(false)
    setCustomType("")
  }

  const updateDistraction = (index: number, field: keyof Omit<Distraction, "id" | "sessionId" | "createdAt" | "type">, value: any) => {
    const updated = [...distractions]
    updated[index] = { ...updated[index], [field]: value }
    setDistractions(updated)
  }

  const removeDistraction = (index: number) => setDistractions(distractions.filter((_, i) => i !== index))

  const handleComplete = () => {
    distractions.forEach(d => {
      storage.addDistraction({
        id: crypto.randomUUID(),
        sessionId,
        ...d,
        createdAt: new Date().toISOString(),
      })
    })
    onComplete()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Session Complete!</CardTitle>
        <CardDescription>Log any distractions you experienced (optional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common Distractions */}
        <div className="space-y-3">
          <Label>What distracted you?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_DISTRACTIONS.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addDistraction(type)}
                className="h-20 flex-col gap-2"
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setShowCustom(!showCustom)}
              className="h-20 flex-col gap-2"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Custom</span>
            </Button>
          </div>
        </div>

        {/* Custom Input */}
        {showCustom && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom distraction..."
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customType.trim()) addDistraction(customType.trim())
              }}
            />
            <Button
              onClick={() => customType.trim() && addDistraction(customType.trim())}
              disabled={!customType.trim()}
            >
              Add
            </Button>
          </div>
        )}

        {/* Logged Distractions */}
        {distractions.length > 0 && (
          <div className="space-y-4">
            <Label>Your Distractions</Label>
            {distractions.map((d, idx) => (
              <Card key={idx} className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium capitalize">{d.type.replace("-", " ")}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeDistraction(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={d.duration}
                      onChange={(e) => updateDistraction(idx, "duration", Number(e.target.value) || 1)}
                      className="w-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Intensity</Label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map(level => (
                        <Button
                          key={level}
                          size="sm"
                          variant={d.intensity === level ? "default" : "outline"}
                          onClick={() => updateDistraction(idx, "intensity", level)}
                          className={cn(d.intensity === level && "bg-primary text-background hover:bg-primary/80")}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Notes (optional)</Label>
                    <Textarea
                      placeholder="Add any details..."
                      value={d.notes}
                      onChange={(e) => updateDistraction(idx, "notes", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onComplete}>
            Skip
          </Button>
          <Button className="bg-primary text-background hover:bg-primary/80" onClick={handleComplete}>
            {distractions.length > 0 ? "Save & Continue" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
