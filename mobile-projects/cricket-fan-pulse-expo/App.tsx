import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Poll = {
  id: string;
  prompt: string;
  subtitle: string;
  totalFans: string;
  options: PollOption[];
};

const initialPolls: Poll[] = [
  {
    id: 'win-prediction',
    prompt: 'Who wins tonight?',
    subtitle: 'Mumbai vs Chennai • Fan confidence check',
    totalFans: '12.4K fans already voted',
    options: [
      { id: 'mumbai', label: 'Mumbai takes it', votes: 54 },
      { id: 'chennai', label: 'Chennai closes strong', votes: 46 },
    ],
  },
  {
    id: 'powerplay',
    prompt: 'Best powerplay strategy?',
    subtitle: 'Pick the fan call before toss time',
    totalFans: '8.1K fans joined the debate',
    options: [
      { id: 'attack', label: 'Go hard in the first 6 overs', votes: 61 },
      { id: 'anchor', label: 'Anchor one end and build', votes: 39 },
    ],
  },
];

export default function App() {
  const [polls, setPolls] = useState(initialPolls);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});

  const votedCount = useMemo(
    () => Object.keys(selectedVotes).length,
    [selectedVotes]
  );

  const handleVote = (pollId: string, optionId: string) => {
    if (selectedVotes[pollId]) {
      return;
    }

    setSelectedVotes((current) => ({
      ...current,
      [pollId]: optionId,
    }));

    setPolls((currentPolls) =>
      currentPolls.map((poll) => {
        if (poll.id !== pollId) {
          return poll;
        }

        return {
          ...poll,
          options: poll.options.map((option) =>
            option.id === optionId
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
        };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Fan Pulse</Text>
          <Text style={styles.heroTitle}>Live cricket, but with fan energy.</Text>
          <Text style={styles.heroSubtitle}>
            Add opinion, prediction, and rivalry to every match with daily polls that
            keep fans involved beyond score updates.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>{polls.length}</Text>
              <Text style={styles.heroStatLabel}>Live polls</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>{votedCount}</Text>
              <Text style={styles.heroStatLabel}>Your votes</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>24/7</Text>
              <Text style={styles.heroStatLabel}>Match buzz</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s fan polls</Text>
          <Text style={styles.sectionSubtitle}>
            Quick, low-friction interactions that make the app feel alive.
          </Text>
        </View>

        {polls.map((poll) => {
          const selectedOptionId = selectedVotes[poll.id];
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

          return (
            <View key={poll.id} style={styles.pollCard}>
              <Text style={styles.pollPrompt}>{poll.prompt}</Text>
              <Text style={styles.pollSubtitle}>{poll.subtitle}</Text>
              <Text style={styles.pollMeta}>{poll.totalFans}</Text>

              <View style={styles.optionsList}>
                {poll.options.map((option) => {
                  const percentage = Math.round((option.votes / totalVotes) * 100);
                  const isSelected = selectedOptionId === option.id;
                  const hasVoted = Boolean(selectedOptionId);

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => handleVote(poll.id, option.id)}
                      disabled={hasVoted}
                      style={[
                        styles.optionButton,
                        hasVoted && styles.optionButtonVoted,
                        isSelected && styles.optionButtonSelected,
                      ]}
                    >
                      <View style={styles.optionTopRow}>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                        <Text style={styles.optionPercent}>{percentage}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                      </View>
                      <Text style={styles.voteCount}>{option.votes} votes</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.pollFooter}>
                {selectedOptionId
                  ? 'Vote locked in. Check back after the innings break for the next fan question.'
                  : 'Tap one option to join the fan verdict.'}
              </Text>
            </View>
          );
        })}

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why this fixes the product gap</Text>
          <Text style={styles.whyCopy}>
            Score apps win on speed. Fan Pulse can win on community. These polls add
            prediction, rivalry, and emotional investment without needing a full social
            feed or heavy backend work.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#081120',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#111d35',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1d315b',
  },
  kicker: {
    color: '#7cc6fe',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#f7fbff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#b6c6dd',
    fontSize: 15,
    lineHeight: 22,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: '#0b1529',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  heroStatValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroStatLabel: {
    color: '#8ea2c2',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingTop: 4,
  },
  sectionTitle: {
    color: '#f3f7fd',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: '#98abc7',
    fontSize: 14,
    lineHeight: 20,
  },
  pollCard: {
    backgroundColor: '#101a30',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1a2a48',
  },
  pollPrompt: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  pollSubtitle: {
    color: '#b1c1d8',
    fontSize: 14,
    marginBottom: 6,
  },
  pollMeta: {
    color: '#72bef8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#0b1528',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2946',
  },
  optionButtonVoted: {
    opacity: 0.94,
  },
  optionButtonSelected: {
    borderColor: '#49b7ff',
    backgroundColor: '#10203f',
  },
  optionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  optionLabel: {
    color: '#f4f8fd',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  optionPercent: {
    color: '#7fd0ff',
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#172641',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#31b0ff',
  },
  voteCount: {
    color: '#92a7c8',
    fontSize: 12,
    fontWeight: '600',
  },
  pollFooter: {
    color: '#93a7c7',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  whyCard: {
    backgroundColor: '#0d1730',
    borderWidth: 1,
    borderColor: '#23365b',
    borderRadius: 20,
    padding: 18,
  },
  whyTitle: {
    color: '#f7fbff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  whyCopy: {
    color: '#b9c8dd',
    fontSize: 14,
    lineHeight: 21,
  },
});
