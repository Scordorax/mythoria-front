import { CollectionItemModel } from "../models/collection.model";

export class DeckFactory {

    static generate(cards: CollectionItemModel[], selectedTypes: string[]) {

        // 🔥 filtrer par types
        const filtered = cards.filter(c => selectedTypes.includes(c.type));

        // 🔥 score (IA simple)
        const scored = filtered.map(card => ({
            card,
            score: this.calculateScore(card)
        }));

        // 🔥 tri par score décroissant
        scored.sort((a, b) => b.score - a.score);

        const deck: { card: CollectionItemModel, quantity: number }[] = [];

        let totalCards = 0;
        const MAX_DECK = 30;
        const MAX_PER_CARD = 3;

        for (const item of scored) {

            const available = item.card.quantity;
            const maxAdd = Math.min(available, MAX_PER_CARD);

            for (let i = 0; i < maxAdd; i++) {

                if (totalCards >= MAX_DECK) break;

                const existing = deck.find(d => d.card.cardId === item.card.cardId);

                if (existing) {
                    existing.quantity++;
                } else {
                    deck.push({ card: item.card, quantity: 1 });
                }

                totalCards++;
            }

            if (totalCards >= MAX_DECK) break;
        }

        return deck;
    }

    // 🧠 score intelligent
    private static calculateScore(card: CollectionItemModel): number {

        const attack = card.attack || 0;
        const defense = card.defense || 0;
        const hp = card.hp || 0;
        const cost = card.energyCost || 1;

        // formule simple (tu peux améliorer)
        return (attack * 1.5) + defense + hp - (cost * 0.5);
    }
}