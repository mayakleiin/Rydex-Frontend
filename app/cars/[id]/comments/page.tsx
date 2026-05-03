"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Loader2, Send, Trash2 } from "lucide-react";

function getAvatarUrl(profileImage?: string) {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profileImage}`;
}

export default function CarCommentsPage() {
  const params = useParams();
  const carId = params.id as string;

  const [comments, setComments] = useState<any[]>([]);
  const [carTitle, setCarTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")?._id
      : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [carRes, commentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${carId}`),
        ]);

        const carData = await carRes.json();
        const commentsData = await commentsRes.json();

        setCarTitle(carData.title || "Car");
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [carId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${carId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment.trim() }),
        },
      );

      if (!res.ok) return;

      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.ok) {
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/cars/${carId}`}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to car
          </Link>
        </Button>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium italic mb-2">
          Comments
        </h1>

        <p className="text-muted-foreground mb-8">{carTitle}</p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4 min-h-[120px]"
              />

              <div className="flex justify-end">
                <Button disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No comments yet.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment._id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={getAvatarUrl(comment.author?.profileImage)}
                      />
                      <AvatarFallback>
                        {comment.author?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="font-medium">
                            {comment.author?.username || "User"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {currentUserId &&
                          comment.author?._id === currentUserId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(comment._id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                      </div>

                      <p className="mt-3 text-muted-foreground whitespace-pre-line">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
