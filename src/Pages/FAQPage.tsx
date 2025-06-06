"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { submitQuestion } from "../lib/firebase"
import ThankYouModal from "../components/ThankYouModal"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

const FAQPage: React.FC = () => {
  const categories = ["All", "General", "About Notion", "Recruitment"]
  const [activeCategory, setActiveCategory] = useState("All")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    vitEmail: "",
    query: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What is the Notion Community Club, and how does it benefit students at VIT Bhopal?",
      answer:
        "The Notion Community Club is a student-led initiative that focuses on technology, entrepreneurship, and innovation. It benefits students by offering opportunities to develop skills, leadership qualities, and participate in impactful events.",
      category: "General",
    },
    {
      id: 2,
      question: "What are the primary goals of the Notion Community Club?",
      answer:
        "The club aims to empower students by fostering innovation, creativity, and hands-on learning to tackle real-world challenges effectively.",
      category: "General",
    },
    {
      id: 3,
      question: "How is the club structured, and what are the different teams within Notion?",
      answer:
        "The club is divided into specialized teams: Content, Creative, Media, Operations, Corporate, Outreach, Anchoring, and Tech Teams. Each team contributes uniquely to the club's initiatives.",
      category: "General",
    },
    {
      id: 4,
      question: "How can students apply to join the Notion Community Club?",
      answer:
        "Students can apply during recruitment drives by filling out an online form. Notifications are shared on social media and through campus promotions.",
      category: "Recruitment",
    },
    {
      id: 5,
      question: "What are the criteria for selecting new members for the club?",
      answer:
        "Selection is based on skills, enthusiasm, and alignment with the club's goals. The process may include interviews and practical evaluations.",
      category: "Recruitment",
    },
    {
      id: 6,
      question: "What are the different roles or responsibilities available for new recruits?",
      answer:
        "New recruits can join teams like Content, Creative, Media, Operations, Corporate, Outreach, Anchoring, or Tech, based on their skills and interest.",
      category: "Recruitment",
    },
    {
      id: 7,
      question: "How does the recruitment process help identify leadership potential?",
      answer:
        "The process assesses problem-solving abilities, creativity, and communication skills, helping identify candidates with leadership qualities.",
      category: "Recruitment",
    },
    {
      id: 8,
      question: "Are there any prerequisites or specific skills required to join the club?",
      answer:
        "While no specific prerequisites are required, basic skills related to the desired team (e.g., writing for Content or design for Creative) are beneficial.",
      category: "Recruitment",
    },
    {
      id: 9,
      question: "What is the Notion Community at VIT Bhopal?",
      answer: "The Notion Community at VIT Bhopal is a group dedicated to promoting productivity through Notion.",
      category: "About Notion",
    },
    {
      id: 10,
      question: "Who can join the Notion Community?",
      answer: "Anyone who is interested in learning new things.",
      category: "About Notion",
    },
    {
      id: 11,
      question: "What kind of events do you organize?",
      answer: "We organize workshops and various sessions on productivity.",
      category: "About Notion",
    },
    {
      id: 12,
      question: "Do I need prior experience with Notion to join?",
      answer: "No prior experience is needed.",
      category: "About Notion",
    },
    {
      id: 13,
      question: "How do I sign up for the events?",
      answer: "You can sign up through our website.",
      category: "About Notion",
    },
    {
      id: 14,
      question: "What kind of events does the club typically host, and who can attend them?",
      answer:
        "The club hosts technical workshops, quizzes, hackathons, and productivity sessions. These events are open to all VIT Bhopal students.",
      category: "About Notion",
    },
    {
      id: 15,
      question: "How does the club ensure smooth coordination and execution of its events?",
      answer:
        "The club uses a structured system with specialized teams managing logistics, content creation, media, and technical support for seamless execution.",
      category: "About Notion",
    },
    {
      id: 16,
      question: "What are the challenges faced during event organization, and how are they managed?",
      answer:
        "Common challenges include conflicts, delays, and sponsorship procurement. These are addressed through communication, backup plans, and proactive collaboration with sponsors and administration.",
      category: "About Notion",
    },
    {
      id: 17,
      question: "How does the club collaborate with sponsors and external organizations?",
      answer:
        "The Corporate Team pitches to potential sponsors, highlighting mutual benefits. Successful collaborations have included Coding Ninjas, xyz, and Unstop.",
      category: "About Notion",
    },
  ]

  const filteredFAQs = activeCategory === "All" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.vitEmail.trim()) {
      newErrors.vitEmail = "VIT email is required"
    } else if (!formData.vitEmail.includes("@vitbhopal.ac.in")) {
      newErrors.vitEmail = "Please use your VIT Bhopal email address"
    }

    if (!formData.query.trim()) {
      newErrors.query = "Query is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitQuestion({
        firstName: formData.firstName,
        lastName: formData.lastName,
        vitEmail: formData.vitEmail,
        query: formData.query,
        submittedAt: new Date().toISOString(),
      })

      setShowThankYou(true)
      setFormData({
        firstName: "",
        lastName: "",
        vitEmail: "",
        query: "",
      })
    } catch (error) {
      console.error("Error submitting question:", error)
      alert("There was an error submitting your question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-32 md:py-40">
      <h1 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h1>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                {openFAQ === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openFAQ === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700">{faq.answer}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{faq.category}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold mb-4 inter">Questions</h2>
              <p className="text-xl mb-6 inter">Reach out</p>
              <img
                src="https://github.com/notion-vit/NotionCommunityVITB/blob/main/assets/img-removebg-preview.png?raw=true"
                alt="Person with questions"
                className="w-full max-w-xs"
              />
            </div>

            <div className="flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg inter mb-2" htmlFor="firstName">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 ${errors.firstName ? "border-red-500" : "border-gray-300"} focus:border-black outline-none pb-2 bg-transparent`}
                      disabled={isSubmitting}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-lg inter mb-2" htmlFor="lastName">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 ${errors.lastName ? "border-red-500" : "border-gray-300"} focus:border-black outline-none pb-2 bg-transparent`}
                      disabled={isSubmitting}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg inter mb-2" htmlFor="vitEmail">
                      VIT Email ID *
                    </label>
                    <input
                      type="email"
                      id="vitEmail"
                      value={formData.vitEmail}
                      onChange={handleInputChange}
                      placeholder="example@vitbhopal.ac.in"
                      className={`w-full border-b-2 ${errors.vitEmail ? "border-red-500" : "border-gray-300"} focus:border-black outline-none pb-2 bg-transparent`}
                      disabled={isSubmitting}
                    />
                    {errors.vitEmail && <p className="text-red-500 text-sm mt-1">{errors.vitEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-lg inter mb-2" htmlFor="query">
                      Query *
                    </label>
                    <input
                      type="text"
                      id="query"
                      value={formData.query}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 ${errors.query ? "border-red-500" : "border-gray-300"} focus:border-black outline-none pb-2 bg-transparent`}
                      disabled={isSubmitting}
                    />
                    {errors.query && <p className="text-red-500 text-sm mt-1">{errors.query}</p>}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        message={
          <div className="text-center">
            <p className="text-xl font-medium mb-4">Thank you for your question!</p>
            <p className="text-gray-600">Your question has been submitted successfully. We'll get back to you soon!</p>
          </div>
        }
      />
    </div>
  )
}

export default FAQPage
