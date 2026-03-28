import { CollectionItemModel } from "../models/collection.model";

export type DeckStrategy = 'aggressive' | 'control' | 'combo' | 'balanced';

export class DeckFactory {

    static generate(
        cards: CollectionItemModel[],
        selectedTypes: string[],
        strategy: DeckStrategy = 'balanced'
    ) {

        const filtered = cards.filter(c => selectedTypes.includes(c.type));

        const scored = filtered.map(card => ({
            card,
            score: this.calculateScore(card, strategy)
        }));

        // 🔥 tri
        scored.sort((a, b) => b.score - a.score);

        const deck: { card: CollectionItemModel, quantity: number }[] = [];

        let total = 0;
        const MAX = 30;

        for (const item of scored) {

            const maxAdd = Math.min(item.card.quantity, 3);

            for (let i = 0; i < maxAdd; i++) {

                if (total >= MAX) break;

                const existing = deck.find(d => d.card.cardId === item.card.cardId);

                if (existing) {
                    existing.quantity++;
                } else {
                    deck.push({ card: item.card, quantity: 1 });
                }

                total++;
            }

            if (total >= MAX) break;
        }

        return deck;
    }

    // 🧠 SCORE INTELLIGENT SELON STRATÉGIE
    private static calculateScore(card: CollectionItemModel, strategy: DeckStrategy): number {

        const attack = card.attack || 0;
        const defense = card.defense || 0;
        const hp = card.hp || 0;
        const cost = card.energyCost || 1;

        // 🔥 AGRO (rapide, attaque)
        if (strategy === 'aggressive') {
            return (attack * 2) + (hp * 0.5) - cost;
        }

        // 🛡️ CONTRÔLE (tank + défense)
        if (strategy === 'control') {
            return (hp * 2) + defense - cost;
        }

        // ⚙️ COMBO (équilibré + coût modéré)
        if (strategy === 'combo') {
            return (attack + defense + hp) - (cost * 0.3);
        }

        // ⚖️ BALANCED (par défaut)
        return attack + defense + hp - cost;
    }
}