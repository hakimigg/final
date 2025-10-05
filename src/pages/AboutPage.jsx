import React from "react";
import { createPageUrl } from "../utils";
import { Award, Users, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-amber-50 to-rose-100 opacity-50" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Our Purpose
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-stone-800">Our Mission</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl bg-stone-100 flex items-center justify-center"
            >
              <Package className="w-32 h-32 text-stone-300" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gradient-to-br from-stone-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-stone-800">Our Values</h2>
            <p className="text-lg text-stone-600">What drives us every day</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                color: "from-amber-500 to-orange-600",
                title: "Quality",
                desc: "Excellence in craftsmanship and materials"
              },
              {
                icon: Leaf,
                color: "from-green-500 to-emerald-600",
                title: "Sustainability",
                desc: "Committed to eco-friendly practices"
              },
              {
                icon: Users,
                color: "from-blue-500 to-indigo-600",
                title: "Community",
                desc: "Supporting artisans and local makers"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center` }>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-800">{value.title}</h3>
                <p className="text-stone-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our collection and find pieces that speak to your style
            </p>
            <a href={createPageUrl("Products")}>
              <button className="px-10 py-5 bg-white text-emerald-700 rounded-full font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                Shop Our Collection
              </button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
