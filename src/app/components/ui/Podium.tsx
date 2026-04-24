import { motion } from "motion/react";
import { Trophy, Medal, Award } from "lucide-react";

interface Player {
  name: string;
  image: string;
  place: 1 | 2 | 3;
}

const players: Player[] = [
  {
    name: "Champion",
    image:
      "https://images.unsplash.com/photo-1726195221775-e1d394a19f02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    place: 1,
  },
  {
    name: "Runner-up",
    image:
      "https://images.unsplash.com/photo-1726195221712-621a02410577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    place: 2,
  },
  {
    name: "Third Place",
    image:
      "https://images.unsplash.com/photo-1619376269004-7e287504b323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    place: 3,
  },
];

const podiumConfig = {
  1: {
    height: "h-96",
    borderColor: "border-yellow-400",
    glowColor: "shadow-yellow-500/60",
    icon: Trophy,
    iconBg: "bg-yellow-400",
    iconColor: "text-yellow-900",
    overlayGradient: "from-yellow-400/30 via-transparent to-yellow-600/50",
    delay: 0.4,
    order: 2,
  },
  2: {
    height: "h-80",
    borderColor: "border-gray-400",
    glowColor: "shadow-gray-400/60",
    icon: Medal,
    iconBg: "bg-gray-400",
    iconColor: "text-gray-900",
    overlayGradient: "from-gray-300/30 via-transparent to-gray-500/50",
    delay: 0.2,
    order: 1,
  },
  3: {
    height: "h-72",
    borderColor: "border-orange-600",
    glowColor: "shadow-orange-600/60",
    icon: Award,
    iconBg: "bg-orange-600",
    iconColor: "text-orange-100",
    overlayGradient: "from-orange-600/30 via-transparent to-orange-800/50",
    delay: 0.6,
    order: 3,
  },
};

export default function Podium() {
  const sortedPlayers = [...players].sort((a, b) => {
    return podiumConfig[a.place].order - podiumConfig[b.place].order;
  });

  return (
    <div className="flex items-end justify-center gap-6 px-8">
      {sortedPlayers.map((player) => {
        const config = podiumConfig[player.place];
        const Icon = config.icon;

        return (
          <motion.div
            key={player.place}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: config.delay,
              duration: 0.8,
              type: "spring",
              bounce: 0.4,
            }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: config.delay,
                duration: 0.8,
                type: "spring",
              }}
              className={`${config.height} w-52 rounded-t-3xl shadow-2xl ${config.glowColor} overflow-hidden origin-bottom relative border-4 ${config.borderColor}`}
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${config.overlayGradient} backdrop-blur-[1px]`}
              />

              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: config.delay,
                }}
                className="absolute bottom-0 left-0 right-0 flex flex-col items-center text-center px-4 pb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: config.delay + 0.5,
                    type: "spring",
                    bounce: 0.6,
                  }}
                  className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center shadow-2xl mb-3`}
                >
                  <Icon className={`w-8 h-8 ${config.iconColor}`} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: config.delay + 0.6 }}
                  className="text-white drop-shadow-2xl"
                >
                  <div className="text-6xl font-black mb-2">{player.place}</div>
                  <div className="text-base font-bold uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                    {player.place === 1
                      ? "1st"
                      : player.place === 2
                        ? "2nd"
                        : "3rd"}{" "}
                    Place
                  </div>
                  <div className="text-sm font-semibold mt-2 opacity-90">
                    {player.name}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 border-4 ${config.borderColor} rounded-t-3xl pointer-events-none`}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
