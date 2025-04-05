import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Check, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Button as ShadButton } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator as RadSeparator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress as Progress2 } from "@/components/ui/progress"
import {
  ResizableHandle as ResizableHandle2,
  ResizablePanel as ResizablePanel2,
  ResizablePanelGroup as ResizablePanelGroup2,
  ResizableSeparator as ResizableSeparator2,
} from "@/components/ui/resizable"
import {
  Command as Command2,
  CommandDialog,
  CommandEmpty as CommandEmpty2,
  CommandGroup as CommandGroup2,
  CommandInput as CommandInput2,
  CommandItem as CommandItem2,
  CommandList as CommandList2,
  CommandSeparator as CommandSeparator2,
} from "@/components/ui/command"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import { Icons } from "@/components/Icons"
import { Input as Input2 } from "@/components/ui/input"
import { Label as Label2 } from "@/components/ui/label"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select as Select2,
  SelectContent as SelectContent2,
  SelectItem as SelectItem2,
  SelectTrigger as SelectTrigger2,
  SelectValue as SelectValue2,
} from "@/components/ui/select"
import {
  Slider as Slider2,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider"
import {
  Switch as Switch2,
} from "@/components/ui/switch"
import {
  Table as Table2,
  TableBody as TableBody2,
  TableCaption as TableCaption2,
  TableCell as TableCell2,
  TableFooter as TableFooter2,
  TableHead as TableHead2,
  TableHeader as TableHeader2,
  TableRow as TableRow2,
} from "@/components/ui/table"
import {
  Textarea as Textarea2,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip2,
  TooltipContent as TooltipContent2,
  TooltipProvider as TooltipProvider2,
  TooltipTrigger as TooltipTrigger2,
} from "@/components/ui/tooltip"
import {
  useFormField,
} from "@/components/ui/form"
import {
  AlertDialog as AlertDialog2,
  AlertDialogAction as AlertDialogAction2,
  AlertDialogCancel as AlertDialogCancel2,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
  AlertDialogTrigger as AlertDialogTrigger2,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu2,
  ContextMenuContent as ContextMenuContent2,
  ContextMenuItem as ContextMenuItem2,
  ContextMenuLabel as ContextMenuLabel2,
  ContextMenuSeparator as ContextMenuSeparator2,
  ContextMenuTrigger as ContextMenuTrigger2,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog2,
  DialogContent as DialogContent2,
  DialogDescription as DialogDescription2,
  DialogHeader as DialogHeader2,
  DialogTitle as DialogTitle2,
  DialogTrigger as DialogTrigger2,
} from "@/components/ui/dialog"
import {
  DropdownMenu as DropdownMenu2,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem2,
  DropdownMenuContent as DropdownMenuContent2,
  DropdownMenuItem as DropdownMenuItem2,
  DropdownMenuLabel as DropdownMenuLabel2,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup2,
  DropdownMenuRadioItem as DropdownMenuRadioItem2,
  DropdownMenuSeparator as DropdownMenuSeparator2,
  DropdownMenuShortcut as DropdownMenuShortcut2,
  DropdownMenuSub as DropdownMenuSub2,
  DropdownMenuSubContent as DropdownMenuSubContent2,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger2,
  DropdownMenuTrigger as DropdownMenuTrigger2,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard2,
  HoverCardContent as HoverCardContent2,
  HoverCardDescription as HoverCardDescription2,
  HoverCardHeader as HoverCardHeader2,
  HoverCardTitle as HoverCardTitle2,
  HoverCardTrigger as HoverCardTrigger2,
} from "@/components/ui/hover-card"
import {
  Sheet as Sheet2,
  SheetClose as SheetClose2,
  SheetContent as SheetContent2,
  SheetDescription as SheetDescription2,
  SheetFooter as SheetFooter2,
  SheetHeader as SheetHeader2,
  SheetTitle as SheetTitle2,
  SheetTrigger as SheetTrigger2,
} from "@/components/ui/sheet"
import {
  Tabs as Tabs2,
  TabsContent as TabsContent2,
  TabsList as TabsList2,
  TabsTrigger as TabsTrigger2,
} from "@/components/ui/tabs"
import {
  Accordion as Accordion2,
  AccordionContent as AccordionContent2,
  AccordionItem as AccordionItem2,
  AccordionTrigger as AccordionTrigger2,
} from "@/components/ui/accordion"
import {
  Avatar as Avatar2,
  AvatarFallback as AvatarFallback2,
} from "@/components/ui/avatar"
import {
  Badge as Badge2,
} from "@/components/ui/badge"
import {
  Button as Button2,
} from "@/components/ui/button"
import {
  Calendar as Calendar2,
} from "@/components/ui/calendar"
import {
  Card as Card2,
  CardContent as CardContent2,
  CardDescription as CardDescription2,
  CardFooter as CardFooter2,
  CardHeader as CardHeader2,
  CardTitle as CardTitle2,
} from "@/components/ui/card"
import {
  Checkbox as Checkbox2,
} from "@/components/ui/checkbox"
import {
  CommandDialog as CommandDialog2,
} from "@/components/ui/command"
import {
  Drawer as Drawer2,
  DrawerClose as DrawerClose2,
  DrawerContent as DrawerContent2,
  DrawerDescription as DrawerDescription2,
  DrawerFooter as DrawerFooter2,
  DrawerHeader as DrawerHeader2,
  DrawerTitle as DrawerTitle2,
  DrawerTrigger as DrawerTrigger2,
} from "@/components/ui/drawer"
import {
  Form as Form2,
  FormControl as FormControl2,
  FormField as FormField2,
  FormItem as FormItem2,
  FormLabel as FormLabel2,
  FormMessage as FormMessage2,
} from "@/components/ui/form"
import {
  Input as Input3,
} from "@/components/ui/input"
import {
  Label as Label3,
} from "@/components/ui/label"
import {
  Menubar as Menubar2,
  MenubarContent as MenubarContent2,
  MenubarItem as MenubarItem2,
  MenubarMenu as MenubarMenu2,
  MenubarRadioGroup as MenubarRadioGroup2,
  MenubarRadioItem as MenubarRadioItem2,
  MenubarSeparator as MenubarSeparator2,
  MenubarSub as MenubarSub2,
  MenubarSubContent as MenubarSubContent2,
  MenubarSubTrigger as MenubarSubTrigger2,
  MenubarTrigger as MenubarTrigger2,
} from "@/components/ui/menubar"
import {
  NavigationMenu as NavigationMenu2,
  NavigationMenuContent as NavigationMenuContent2,
  NavigationMenuItem as NavigationMenuItem2,
  NavigationMenuLink as NavigationMenuLink2,
  NavigationMenuList as NavigationMenuList2,
  NavigationMenuTrigger as NavigationMenuTrigger2,
  NavigationMenuViewport as NavigationMenuViewport2,
} from "@/components/ui/navigation-menu"
import {
  Pagination as Pagination2,
  PaginationContent as PaginationContent2,
  PaginationEllipsis as PaginationEllipsis2,
  PaginationItem as PaginationItem2,
  PaginationLink as PaginationLink2,
  PaginationNext as PaginationNext2,
  PaginationPrevious as PaginationPrevious2,
} from "@/components/ui/pagination"
import {
  Progress as Progress3,
} from "@/components/ui/progress"
import {
  RadioGroup as RadioGroup2,
  RadioGroupItem as RadioGroupItem2,
} from "@/components/ui/radio-group"
import {
  ScrollArea as ScrollArea2,
} from "@/components/ui/scroll-area"
import {
  Select as Select3,
  SelectContent as SelectContent3,
  SelectItem as SelectItem3,
  SelectTrigger as SelectTrigger3,
  SelectValue as SelectValue3,
} from "@/components/ui/select"
import {
  Separator as Separator2,
} from "@/components/ui/separator"
import {
  Sheet as Sheet3,
  SheetClose as SheetClose3,
  SheetContent as SheetContent3,
  SheetDescription as SheetDescription3,
  SheetFooter as SheetFooter3,
  SheetHeader as SheetHeader3,
  SheetTitle as SheetTitle3,
  SheetTrigger as SheetTrigger3,
} from "@/components/ui/sheet"
import {
  Skeleton as Skeleton2,
} from "@/components/ui/skeleton"
import {
  Slider as Slider3,
  SliderThumb as SliderThumb2,
  SliderTrack as SliderTrack2,
} from "@/components/ui/slider"
import {
  Switch as Switch3,
} from "@/components/ui/switch"
import {
  Table as Table3,
  TableBody as TableBody3,
  TableCaption as TableCaption3,
  TableCell as TableCell3,
  TableFooter as TableFooter3,
  TableHead as TableHead3,
  TableHeader as TableHeader3,
  TableRow as TableRow3,
} from "@/components/ui/table"
import {
  Tabs as Tabs3,
  TabsContent as TabsContent3,
  TabsList as TabsList3,
  TabsTrigger as TabsTrigger3,
} from "@/components/ui/tabs"
import {
  Textarea as Textarea3,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip3,
  TooltipContent as TooltipContent3,
  TooltipProvider as TooltipProvider3,
  TooltipTrigger as TooltipTrigger3,
} from "@/components/ui/tooltip"
import {
  useFormField as useFormField2,
} from "@/components/ui/form"
import {
  AspectRatio as AspectRatio2,
} from "@/components/ui/aspect-ratio"
import {
  Carousel as Carousel2,
  CarouselContent as CarouselContent2,
  CarouselItem as CarouselItem2,
  CarouselNext as CarouselNext2,
  CarouselPrevious as CarouselPrevious2,
  useCarousel as useCarousel2,
} from "@/components/ui/carousel"
import {
  Command as Command3,
  CommandDialog as CommandDialog3,
  CommandEmpty as CommandEmpty3,
  CommandGroup as CommandGroup3,
  CommandInput as CommandInput3,
  CommandItem as CommandItem3,
  CommandList as CommandList3,
  CommandSeparator as CommandSeparator3,
} from "@/components/ui/command"
import {
  DropdownMenu as DropdownMenu3,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem3,
  DropdownMenuContent as DropdownMenuContent3,
  DropdownMenuItem as DropdownMenuItem3,
  DropdownMenuLabel as DropdownMenuLabel3,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup3,
  DropdownMenuRadioItem as DropdownMenuRadioItem3,
  DropdownMenuSeparator as DropdownMenuSeparator3,
  DropdownMenuShortcut as DropdownMenuShortcut3,
  DropdownMenuSub as DropdownMenuSub3,
  DropdownMenuSubContent as DropdownMenuSubContent3,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger3,
  DropdownMenuTrigger as DropdownMenuTrigger3,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard3,
  HoverCardContent as HoverCardContent3,
  HoverCardDescription as HoverCardDescription3,
  HoverCardHeader as HoverCardHeader3,
  HoverCardTitle as HoverCardTitle3,
  HoverCardTrigger as HoverCardTrigger3,
} from "@/components/ui/hover-card"
import {
  ResizableHandle as ResizableHandle3,
  ResizablePanel as ResizablePanel3,
  ResizablePanelGroup as ResizablePanelGroup3,
  ResizableSeparator as ResizableSeparator3,
} from "@/components/ui/resizable"
import {
  ScrollArea as ScrollArea3,
} from "@/components/ui/scroll-area"
import {
  Select as Select4,
  SelectContent as SelectContent4,
  SelectItem as SelectItem4,
  SelectTrigger as SelectTrigger4,
  SelectValue as SelectValue4,
} from "@/components/ui/select"
import {
  Sheet as Sheet4,
  SheetClose as SheetClose4,
  SheetContent as SheetContent4,
  SheetDescription as SheetDescription4,
  SheetFooter as SheetFooter4,
  SheetHeader as SheetHeader4,
  SheetTitle as SheetTitle4,
  SheetTrigger as SheetTrigger4,
} from "@/components/ui/sheet"
import {
  Slider as Slider4,
  SliderThumb as SliderThumb3,
  SliderTrack as SliderTrack3,
} from "@/components/ui/slider"
import {
  Table as Table4,
  TableBody as TableBody4,
  TableCaption as TableCaption4,
  TableCell as TableCell4,
  TableFooter as TableFooter4,
  TableHead as TableHead4,
  TableHeader as TableHeader4,
  TableRow as TableRow4,
} from "@/components/ui/table"
import {
  Tabs as Tabs4,
  TabsContent as TabsContent4,
  TabsList as TabsList4,
  TabsTrigger as TabsTrigger4,
} from "@/components/ui/tabs"
import {
  Textarea as Textarea4,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip4,
  TooltipContent as TooltipContent4,
  TooltipProvider as TooltipProvider4,
  TooltipTrigger as TooltipTrigger4,
} from "@/components/ui/tooltip"
import {
  useFormField as useFormField3,
} from "@/components/ui/form"
import {
  AlertDialog as AlertDialog3,
  AlertDialogAction as AlertDialogAction3,
  AlertDialogCancel as AlertDialogCancel3,
  AlertDialogContent as AlertDialogContent3,
  AlertDialogDescription as AlertDialogDescription3,
  AlertDialogFooter as AlertDialogFooter3,
  AlertDialogHeader as AlertDialogHeader3,
  AlertDialogTitle as AlertDialogTitle3,
  AlertDialogTrigger as AlertDialogTrigger3,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu3,
  ContextMenuContent as ContextMenuContent3,
  ContextMenuItem as ContextMenuItem3,
  ContextMenuLabel as ContextMenuLabel3,
  ContextMenuSeparator as ContextMenuSeparator3,
  ContextMenuTrigger as ContextMenuTrigger3,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog3,
  DialogContent as DialogContent3,
  DialogDescription as DialogDescription3,
  DialogHeader as DialogHeader3,
  DialogTitle as DialogTitle3,
  DialogTrigger as DialogTrigger3,
} from "@/components/ui/dialog"
import {
  DropdownMenu as DropdownMenu4,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem4,
  DropdownMenuContent as DropdownMenuContent4,
  DropdownMenuItem as DropdownMenuItem4,
  DropdownMenuLabel as DropdownMenuLabel4,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup4,
  DropdownMenuRadioItem as DropdownMenuRadioItem4,
  DropdownMenuSeparator as DropdownMenuSeparator4,
  DropdownMenuShortcut as DropdownMenuShortcut4,
  DropdownMenuSub as DropdownMenuSub4,
  DropdownMenuSubContent as DropdownMenuSubContent4,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger4,
  DropdownMenuTrigger as DropdownMenuTrigger4,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard4,
  HoverCardContent as HoverCardContent4,
  HoverCardDescription as HoverCardDescription4,
  HoverCardHeader as HoverCardHeader4,
  HoverCardTitle as HoverCardTitle4,
  HoverCardTrigger as HoverCardTrigger4,
} from "@/components/ui/hover-card"
import {
  ResizableHandle as ResizableHandle4,
  ResizablePanel as ResizablePanel4,
  ResizablePanelGroup as ResizablePanelGroup4,
  ResizableSeparator as ResizableSeparator4,
} from "@/components/ui/resizable"
import {
  ScrollArea as ScrollArea4,
} from "@/components/ui/scroll-area"
import {
  Select as Select5,
  SelectContent as SelectContent5,
  SelectItem as SelectItem5,
  SelectTrigger as SelectTrigger5,
  SelectValue as SelectValue5,
} from "@/components/ui/select"
import {
  Sheet as Sheet5,
  SheetClose as SheetClose5,
  SheetContent as SheetContent5,
  SheetDescription as SheetDescription5,
  SheetFooter as SheetFooter5,
  SheetHeader as SheetHeader5,
  SheetTitle as SheetTitle5,
  SheetTrigger as SheetTrigger5,
} from "@/components/ui/sheet"
import {
  Slider as Slider5,
  SliderThumb as SliderThumb4,
  SliderTrack as SliderTrack4,
} from "@/components/ui/slider"
import {
  Table as Table5,
  TableBody as TableBody5,
  TableCaption as TableCaption5,
  TableCell as TableCell5,
  TableFooter as TableFooter5,
  TableHead as TableHead5,
  TableHeader as TableHeader5,
  TableRow as TableRow5,
} from "@/components/ui/table"
import {
  Tabs as Tabs5,
  TabsContent as TabsContent5,
  TabsList as TabsList5,
  TabsTrigger as TabsTrigger5,
} from "@/components/ui/tabs"
import {
  Textarea as Textarea5,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip5,
  TooltipContent as TooltipContent5,
  TooltipProvider as TooltipProvider5,
  TooltipTrigger as TooltipTrigger5,
} from "@/components/ui/tooltip"
import {
  useFormField as useFormField4,
} from "@/components/ui/form"
import {
  AlertDialog as AlertDialog4,
  AlertDialogAction as AlertDialogAction4,
  AlertDialogCancel as AlertDialogCancel4,
  AlertDialogContent as AlertDialogContent4,
  AlertDialogDescription as AlertDialogDescription4,
  AlertDialogFooter as AlertDialogFooter4,
  AlertDialogHeader as AlertDialogHeader4,
  AlertDialogTitle as AlertDialogTitle4,
  AlertDialogTrigger as AlertDialogTrigger4,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu4,
  ContextMenuContent as ContextMenuContent4,
  ContextMenuItem as ContextMenuItem4,
  ContextMenuLabel as ContextMenuLabel4,
  ContextMenuSeparator as ContextMenuSeparator4,
  ContextMenuTrigger as ContextMenuTrigger4,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog4,
  DialogContent as DialogContent4,
  DialogDescription as DialogDescription4,
  DialogHeader as DialogHeader4,
  DialogTitle as DialogTitle4,
  DialogTrigger as DialogTrigger4,
} from "@/components/ui/dialog"
import {
  DropdownMenu as DropdownMenu5,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem5,
  DropdownMenuContent as DropdownMenuContent5,
  DropdownMenuItem as DropdownMenuItem5,
  DropdownMenuLabel as DropdownMenuLabel5,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup5,
  DropdownMenuRadioItem as DropdownMenuRadioItem5,
  DropdownMenuSeparator as DropdownMenuSeparator5,
  DropdownMenuShortcut as DropdownMenuShortcut5,
  DropdownMenuSub as DropdownMenuSub5,
  DropdownMenuSubContent as DropdownMenuSubContent5,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger5,
  DropdownMenuTrigger as DropdownMenuTrigger5,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard5,
  HoverCardContent as HoverCardContent5,
  HoverCardDescription as HoverCardDescription5,
  HoverCardHeader as HoverCardHeader5,
  HoverCardTitle as HoverCardTitle5,
  HoverCardTrigger as HoverCardTrigger5,
} from "@/components/ui/hover-card"
import {
  ResizableHandle as ResizableHandle5,
  ResizablePanel as ResizablePanel5,
  ResizablePanelGroup as ResizablePanelGroup5,
  ResizableSeparator as ResizableSeparator5,
} from "@/components/ui/resizable"
import {
  ScrollArea as ScrollArea5,
} from "@/components/ui/scroll-area"
import {
  Select as Select6,
  SelectContent as SelectContent6,
  SelectItem as SelectItem6,
  SelectTrigger as SelectTrigger6,
  SelectValue as SelectValue6,
} from "@/components/ui/select"
import {
  Sheet as Sheet6,
  SheetClose as SheetClose6,
  SheetContent as SheetContent6,
  SheetDescription as SheetDescription6,
  SheetFooter as SheetFooter6,
  SheetHeader as SheetHeader6,
  SheetTitle as SheetTitle6,
  SheetTrigger as SheetTrigger6,
} from "@/components/ui/sheet"
import {
  Slider as Slider6,
  SliderThumb as SliderThumb5,
  SliderTrack as SliderTrack5,
} from "@/components/ui/slider"
import {
  Table as Table6,
  TableBody as TableBody6,
  TableCaption as TableCaption6,
  TableCell as TableCell6,
  TableFooter as TableFooter6,
  TableHead as TableHead6,
  TableHeader as TableHeader6,
  TableRow as TableRow6,
} from "@/components/ui/table"
import {
  Tabs as Tabs6,
  TabsContent as TabsContent6,
  TabsList as TabsList6,
  TabsTrigger as TabsTrigger6,
} from "@/components/ui/tabs"
import {
  Textarea as Textarea6,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip6,
  TooltipContent as TooltipContent6,
  TooltipProvider as TooltipProvider6,
  TooltipTrigger as TooltipTrigger6,
} from "@/components/ui/tooltip"
import {
  useFormField as useFormField5,
} from "@/components/ui/form"
import {
  AlertDialog as AlertDialog5,
  AlertDialogAction as AlertDialogAction5,
  AlertDialogCancel as AlertDialogCancel5,
  AlertDialogContent as AlertDialogContent5,
  AlertDialogDescription as AlertDialogDescription5,
  AlertDialogFooter as AlertDialogFooter5,
  AlertDialogHeader as AlertDialogHeader5,
  AlertDialogTitle as AlertDialogTitle5,
  AlertDialogTrigger as AlertDialogTrigger5,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu5,
  ContextMenuContent as ContextMenuContent5,
  ContextMenuItem as ContextMenuItem5,
  ContextMenuLabel as ContextMenuLabel5,
  ContextMenuSeparator as ContextMenuSeparator5,
  ContextMenuTrigger as ContextMenuTrigger5,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog5,
  DialogContent as DialogContent5,
  DialogDescription as DialogDescription5,
  DialogHeader as DialogHeader5,
  DialogTitle as DialogTitle5,
  DialogTrigger as DialogTrigger5,
} from "@/components/ui/dialog"
import {
  DropdownMenu as DropdownMenu6,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem6,
  DropdownMenuContent as DropdownMenuContent6,
  DropdownMenuItem as DropdownMenuItem6,
  DropdownMenuLabel as DropdownMenuLabel6,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup6,
  DropdownMenuRadioItem as DropdownMenuRadioItem6,
  DropdownMenuSeparator as DropdownMenuSeparator6,
  DropdownMenuShortcut as DropdownMenuShortcut6,
  DropdownMenuSub as DropdownMenuSub6,
  DropdownMenuSubContent as DropdownMenuSubContent6,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger6,
  DropdownMenuTrigger as DropdownMenuTrigger6,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard6,
  HoverCardContent as HoverCardContent6,
  HoverCardDescription as HoverCardDescription6,
  HoverCardHeader as HoverCardHeader6,
  HoverCardTitle as HoverCardTitle6,
  HoverCardTrigger as HoverCardTrigger6,
} from "@/components/ui/hover-card"
import {
  ResizableHandle as ResizableHandle6,
  ResizablePanel as ResizablePanel6,
  ResizablePanelGroup as ResizablePanelGroup6,
  ResizableSeparator as ResizableSeparator6,
} from "@/components/ui/resizable"
import {
  ScrollArea as ScrollArea6,
} from "@/components/ui/scroll-area"
import {
  Select as Select7,
  SelectContent as SelectContent7,
  SelectItem as SelectItem7,
  SelectTrigger as SelectTrigger7,
  SelectValue as SelectValue7,
} from "@/components/ui/select"
import {
  Sheet as Sheet7,
  SheetClose as SheetClose7,
  SheetContent as SheetContent7,
  SheetDescription as SheetDescription7,
  SheetFooter as SheetFooter7,
  SheetHeader as SheetHeader7,
  SheetTitle as SheetTitle7,
  SheetTrigger as SheetTrigger7,
} from "@/components/ui/sheet"
import {
  Slider as Slider7,
  SliderThumb as SliderThumb6,
  SliderTrack as SliderTrack6,
} from "@/components/ui/slider"
import {
  Table as Table7,
  TableBody as TableBody7,
  TableCaption as TableCaption7,
  TableCell as TableCell7,
  TableFooter as TableFooter7,
  TableHead as TableHead7,
  TableHeader as TableHeader7,
  TableRow as TableRow7,
} from "@/components/ui/table"
import {
  Tabs as Tabs7,
  TabsContent as TabsContent7,
  TabsList as TabsList7,
  TabsTrigger as TabsTrigger7,
} from "@/components/ui/tabs"
import {
  Textarea as Textarea7,
} from "@/components/ui/textarea"
import {
  Tooltip as Tooltip7,
  TooltipContent as TooltipContent7,
  TooltipProvider as TooltipProvider7,
  TooltipTrigger as TooltipTrigger7,
} from "@/components/ui/tooltip"
import {
  useFormField as useFormField6,
} from "@/components/ui/form"
import {
  AlertDialog as AlertDialog6,
  AlertDialogAction as AlertDialogAction6,
  AlertDialogCancel as AlertDialogCancel6,
  AlertDialogContent as AlertDialogContent6,
  AlertDialogDescription as AlertDialogDescription6,
  AlertDialogFooter as AlertDialogFooter6,
  AlertDialogHeader as AlertDialogHeader6,
  AlertDialogTitle as AlertDialogTitle6,
  AlertDialogTrigger as AlertDialogTrigger6,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu6,
  ContextMenuContent as ContextMenuContent6,
  ContextMenuItem as ContextMenuItem6,
  ContextMenuLabel as ContextMenuLabel6,
  ContextMenuSeparator as ContextMenuSeparator6,
  ContextMenuTrigger as ContextMenuTrigger6,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog6,
  DialogContent as DialogContent6,
  DialogDescription as DialogDescription6,
  DialogHeader as DialogHeader6,
  DialogTitle as DialogTitle6,
  DialogTrigger as DialogTrigger6,
} from "@/components/ui/dialog"
import {
  DropdownMenu as DropdownMenu7,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem7,
  DropdownMenuContent as DropdownMenuContent7,
  DropdownMenuItem as DropdownMenuItem7,
  DropdownMenuLabel as DropdownMenuLabel7,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup7,
  DropdownMenuRadioItem as DropdownMenuRadioItem7,
  DropdownMenuSeparator as DropdownMenuSeparator7,
  DropdownMenuShortcut as DropdownMenuShortcut7,
  DropdownMenuSub as DropdownMenuSub7,
  DropdownMenuSubContent as DropdownMenuSubContent7,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger7,
  DropdownMenuTrigger as DropdownMenuTrigger7,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard as HoverCard7,
  HoverCardContent as HoverCardContent7,
  HoverCardDescription as HoverCardDescription7,
  HoverCardHeader as HoverCardHeader7,
  HoverCardTitle as HoverCardTitle7,
  HoverCardTrigger as HoverCardTrigger7,
} from "@/components/ui/hover-card"
import {
  ResizableHandle as ResizableHandle7,
  ResizablePanel as ResizablePanel7,
  ResizablePanelGroup as ResizablePanelGroup7,
  ResizableSeparator as ResizableSeparator7,
} from "@/components/ui/resizable"
import {
  ScrollArea as ScrollArea7,
} from "@/components/ui/scroll-area"
import {
  Select as Select8,
