"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/app/config/config"; // If inside app/config
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}


export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Failed to create task");

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
      });

      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });

      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell className="capitalize">{task.priority}</TableCell>
                      <TableCell className="capitalize">{task.status}</TableCell>
                      <TableCell>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}