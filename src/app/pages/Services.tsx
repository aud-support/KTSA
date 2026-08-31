import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Zap, Trophy, Users, X, Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getServices, Service } from "../../services/servicesService";
import { defaultServices } from "../data/servicesData";

// Map icon names to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || <Zap className="w-8 h-8" />;
};

// Service Detail Modal Component
const ServiceDetailModal = ({
  service,
  isOpen,
  onClose,
}: {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Modal wrapper — centres the card, p-4 gives breathing room on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Card — relative so the close button is anchored to it */}
            <div className="relative bg-ktsa-bg rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-ktsa-accent/20 my-auto">

              {/* ── Close button — inside the card, top-right corner ── */}
              <button
                onClick={onClose}
                className="sticky top-3 float-right mr-3 mt-3 z-10 p-2 bg-ktsa-bg/80 backdrop-blur-sm hover:bg-ktsa-primary/20 rounded-full border border-ktsa-accent/30 transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-ktsa-accent" />
              </button>

              {/* Service Image — shorter on mobile, taller on desktop */}
              {service.imageUrl && (
                <div className="h-40 sm:h-52 md:h-64 overflow-hidden rounded-t-2xl">
                  <ImageWithFallback
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 sm:p-8">
                {/* Icon + title row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 sm:p-3 bg-ktsa-accent/10 rounded-lg text-ktsa-accent flex-shrink-0">
                    {getIcon(service.icon)}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ktsa-text leading-tight">
                    {service.name}
                  </h2>
                </div>

                {/* Pricing Badge */}
                <div className="inline-block px-3 py-1.5 bg-ktsa-primary/20 border border-ktsa-primary/40 rounded-full text-ktsa-accent font-bold text-sm sm:text-base mb-4">
                  {service.pricing}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-ktsa-text/80 mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-ktsa-text mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-ktsa-accent" />
                      Key Features & Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 bg-ktsa-primary/10 rounded-lg"
                        >
                          <CheckCircle2
                            size={15}
                            className="text-ktsa-accent mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-ktsa-text/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="border-t border-ktsa-accent/20 pt-5">
                  <h3 className="text-sm sm:text-base font-bold text-ktsa-text mb-3">
                    Ready to get started?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-5 py-3 bg-gradient-to-r from-ktsa-accent to-ktsa-primary text-ktsa-bg font-bold rounded-lg hover:shadow-lg hover:shadow-ktsa-accent/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <Mail size={16} />
                      Contact Us
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-5 py-3 bg-ktsa-primary/10 text-ktsa-accent font-bold rounded-lg hover:bg-ktsa-primary/20 transition-all duration-300 border border-ktsa-accent/30 text-sm sm:text-base"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        // If backend returns services use them, otherwise fall back to default data
        setServices(data.length > 0 ? data : defaultServices);
      } catch (error) {
        console.error("Failed to load services", error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Sort services by displayOrder
  const sortedServices = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300); // Wait for animation to finish
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      {/* Extends behind the transparent fixed navbar (no pt-20 here) */}
      <section className="relative h-[calc(38vh+5rem)] min-h-[320px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNlcnZpY2VzfGVufDB8fHx8MTc3NDkzODUwMnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Services hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/10 via-transparent to-ktsa-highlight/10" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-primary bg-clip-text text-transparent">
                Our{" "}
              </span>
              Services
            </h1>
            <p className="text-sm md:text-base text-ktsa-text/80 font-semibold">
              Comprehensive offerings to support the foosball community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* Introduction Section */}
          <section className="py-12 px-4 bg-ktsa-bg">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center mb-12"
              >
                <p className="text-lg text-ktsa-text/80 leading-relaxed max-w-2xl mx-auto">
                  KTSA provides a comprehensive range of services designed to support and grow
                  the foosball community in Karnataka. From professional table rentals to expert
                  coaching and event management, we're here to help you succeed.
                </p>
              </motion.div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleServiceClick(service)}
                    className="group relative rounded-2xl overflow-hidden border border-ktsa-accent/20 hover:border-ktsa-accent/60 transition-all bg-ktsa-primary/5 hover:bg-ktsa-primary/10 cursor-pointer"
                  >
                    {/* Image background */}
                    {service.imageUrl && (
                      <div className="h-48 overflow-hidden bg-ktsa-primary/10">
                        <ImageWithFallback
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/50 to-transparent" />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Icon */}
                      <div className="mb-4 p-3 bg-ktsa-accent/10 rounded-lg w-fit text-ktsa-accent group-hover:bg-ktsa-accent group-hover:text-ktsa-bg transition-all duration-300">
                        {getIcon(service.icon)}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-ktsa-text mb-3 leading-tight">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-ktsa-text/70 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-ktsa-accent mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-ktsa-text/80">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="pt-4 border-t border-ktsa-accent/20">
                        <p className="text-sm font-semibold text-ktsa-accent flex items-center justify-between group-hover:text-ktsa-primary transition-colors cursor-pointer">
                          {service.pricing}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Service Detail Modal */}
              <ServiceDetailModal service={selectedService} isOpen={isModalOpen} onClose={handleCloseModal} />

              {/* Empty state */}
              {sortedServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-ktsa-text/50">No services available yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-ktsa-primary/5">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-4">
                  Interested in our services?
                </h2>
                <p className="text-ktsa-text/70 mb-8 text-lg">
                  Get in touch with us to discuss your requirements and find the perfect service
                  for your needs.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-ktsa-accent to-ktsa-primary text-ktsa-bg font-bold rounded-full hover:shadow-lg hover:shadow-ktsa-accent/50 transition-all duration-300 hover:scale-105">
                  Contact Us Today
                </button>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
