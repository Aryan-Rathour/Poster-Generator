// "use client"
// // components/PosterGenerator.js
// import { useState } from 'react';
// import axios from 'axios';

// const PosterGenerator = () => {
//   const [festival, setFestival] = useState('');
//   const [theme, setTheme] = useState('');
//   const [color, setColor] = useState('');
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setImageUrl('');

//     try {
//       const response = await axios.post('http://localhost:5000/generate-poster', {
//         festival,
//         theme,
//         color,
//         text,
//       });

//       setImageUrl(response.data.imageUrl);
//     } catch (error) {
//       console.error('Error generating poster:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-30 p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-3xl font-semibold text-center mb-4">Generate Festival Poster</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-lg font-medium">Festival</label>
//           <input
//             type="text"
//             value={festival}
//             onChange={(e) => setFestival(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-lg font-medium">Theme</label>
//           <input
//             type="text"
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-lg font-medium">Color</label>
//           <input
//             type="text"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-lg font-medium">Text</label>
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? 'Generating...' : 'Generate Poster'}
//         </button>
//       </form>

//       {imageUrl && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold text-center">Your Generated Poster</h2>
//           <img src={imageUrl} alt="Generated Poster" className="mt-4 mx-auto rounded-lg shadow-md" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PosterGenerator;


"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "../lib/zod-resolver"
import { z } from "zod"
import axios from "axios"
import { Loader2, Sparkles, Info, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  festival: z.string().min(2, { message: "Festival name must be at least 2 characters" }),
  theme: z.string().min(2, { message: "Theme must be at least 2 characters" }),
  color: z.string().min(2, { message: "Color must be at least 2 characters" }),
  text: z.string().min(2, { message: "Text must be at least 2 characters" }),
})

type FormValues = z.infer<typeof formSchema>

const exampleInputs = [
  { festival: "Summer Vibes", theme: "Beach Party", color: "Blue", text: "Join us for a day of fun!" },
  { festival: "Winter Wonderland", theme: "Snow & Ice", color: "Silver", text: "A magical winter experience" },
  { festival: "Autumn Harvest", theme: "Fall Colors", color: "Orange", text: "Celebrate the season of abundance" },
]

export default function PosterGenerator() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      festival: "",
      theme: "",
      color: "",
      text: "",
    },
  })

  const currentValues = watch()

  const handleGeneratePoster = async (data: FormValues) => {
    setLoading(true)
    setImageUrl("")

    try {
      const response = await axios.post("http://localhost:5000/generate-poster", data)
      setImageUrl(response.data.imageUrl)
      setActiveTab("result")
      toast({
        title: "Poster generated successfully!",
        description: "Your festival poster is ready to view.",
      })
    } catch (error) {
      console.error("Error generating poster:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your poster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyExample = (index: number) => {
    const example = exampleInputs[index]
    setValue("festival", example.festival)
    setValue("theme", example.theme)
    setValue("color", example.color)
    setValue("text", example.text)
    toast({
      title: "Example applied",
      description: "You can now customize or generate with these values.",
    })
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="festival" className="text-base font-medium">
                  Festival Name
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Enter the name of your festival or event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="festival"
                placeholder="Summer Music Festival"
                className="h-12 text-base"
                {...register("festival")}
              />
              {errors.festival && <p className="text-sm text-red-500">{errors.festival.message}</p>}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-base font-medium">
                  Theme
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Describe the theme or style of your festival</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="theme"
                placeholder="Electronic Dance Music"
                className="h-12 text-base"
                {...register("theme")}
              />
              {errors.theme && <p className="text-sm text-red-500">{errors.theme.message}</p>}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color" className="text-base font-medium">
                  Color Scheme
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Choose a primary color or color scheme</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input id="color" placeholder="Neon Blue and Pink" className="h-12 text-base" {...register("color")} />
              {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text" className="text-base font-medium">
                  Tagline or Description
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Add a catchy tagline or brief description</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="text"
                placeholder="Experience the beat like never before"
                className="h-12 text-base"
                {...register("text")}
              />
              {errors.text && <p className="text-sm text-red-500">{errors.text.message}</p>}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary">Festival Poster Generator</h1>
          <p className="mt-3 text-xl text-muted-foreground">Create stunning festival posters with just a few clicks</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="create" className="space-y-8">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Design Your Poster</CardTitle>
                <CardDescription>Fill in the details below to generate your custom festival poster</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleGeneratePoster)} id="poster-form">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Step {step} of 4</h3>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-2 w-10 rounded-full ${
                              i <= step ? "bg-primary" : "bg-muted"
                            } transition-all duration-300`}
                          />
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderFormStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </form>

                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Need inspiration?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {exampleInputs.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto py-3 justify-start text-left cursor-pointer"
                        onClick={() => applyExample(index)}
                      >
                        <div>
                          <p className="font-medium">{example.festival}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{example.theme}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1} className="w-32 cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {step < 4 ? (
                    <Button type="button" onClick={nextStep} className="w-32 cursor-pointer">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      form="poster-form"
                      variant="outline"
                      disabled={loading}
                      className="w-32 bg-gradient-to-r from-primary to-primary/80 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    reset()
                    setStep(1)
                  }}
                  className="text-muted-foreground cursor-pointer"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </CardFooter>
            </Card>

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-2 border-dashed border-muted">
                  <CardHeader>
                    <CardTitle className="text-xl">Preview</CardTitle>
                    <CardDescription>Here's what you've entered so far</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Festival</p>
                        <p className="font-medium">{currentValues.festival || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Theme</p>
                        <p className="font-medium">{currentValues.theme || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Color</p>
                        <p className="font-medium">{currentValues.color || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Text</p>
                        <p className="font-medium">{currentValues.text || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="result">
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-2 shadow-lg">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-2xl">Your Festival Poster</CardTitle>
                    <CardDescription>Here's your generated poster design</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] w-full bg-black/5 flex items-center justify-center">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Generated Festival Poster"
                        className="max-h-full max-w-full object-contain shadow-lg"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("create")
                      }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Editor
                    </Button>
                    <Button
                      onClick={() => {
                        // Download functionality would go here
                        const link = document.createElement("a")
                        link.href = imageUrl
                        link.download = `${currentValues.festival}-poster.jpg`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        toast({
                          title: "Download started",
                          description: "Your poster is being downloaded.",
                        })
                      }}
                    >
                      Download Poster
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

