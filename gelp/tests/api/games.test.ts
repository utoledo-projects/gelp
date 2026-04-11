import { GET } from '@/app/api/games/search/route';
import { Game } from '@/db';
import { NextRequest  } from 'next/server';

jest.mock('@/db', () => ({
    Game: {
        find: jest.fn(),
    },
}));

describe('GET /api/games/search', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns empty array when query is missing', async () => {
        const request = new NextRequest('http://localhost/api/games/search');
        const response = await GET(request);
        const data = await response.json();
        expect(data).toEqual([]);
    });

    it('searches games by title (case-insensitive)', async () => {
        const mockGames = [
            { _id: '1', title: 'Elden Ring'},
            { _id: '2', title: 'Elder Scrolls V'},
        ];

        const expectedData = [
            { id: '1', title: 'Elden Ring'},
            { id: '2', title: 'Elder Scrolls V'},
        ];

        (Game.find as jest.Mock).mockReturnValue({
            limit: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(mockGames),
                }),
            }),
        });

        const request = new NextRequest('http://localhost/api/games/search?q=elder');
        const response = await GET(request);
        const data = await response.json();

        expect(data).toEqual(expectedData);
        expect(Game.find).toHaveBeenCalledWith({
            title: { $regex: 'elder', $options: 'i' },
        });

        const mockChain = (Game.find as jest.Mock).mock.results[0].value;
        expect(mockChain.limit().select).toHaveBeenCalledWith('_id title');
    });

    it ('limits results to 10', async() => {
        (Game.find as jest.Mock).mockReturnValue({
            limit: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue([]),
                }),
            }),
        });

        const request = new NextRequest('http://localhost/api/games/search?q=game');
        await GET(request);

        const mockChain = (Game.find as jest.Mock).mock.results[0].value;
        expect(mockChain.limit).toHaveBeenCalledWith(10);
    });

    it('handles errors gracefully', async() => {
        (Game.find as jest.Mock).mockImplementation(() => {
            throw new Error ('Database error');
        });

        const request = new NextRequest('http://localhost/api/games/search?q=game');
        const response = await GET(request);
        expect(response.status).toBe(500);
    });
});