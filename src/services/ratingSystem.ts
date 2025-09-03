// Rating System Service for SkyShip Logistics
// Handles customer ratings and reviews for services and support

export interface Rating {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: 'shipping' | 'support' | 'overall' | 'website' | 'app';
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  tags: string[];
  isVerified: boolean;
  isPublic: boolean;
  isModerated: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  response?: {
    agentId: string;
    agentName: string;
    response: string;
    respondedAt: Date;
  };
  metadata: {
    shipmentId?: string;
    trackingNumber?: string;
    serviceType?: string;
    origin?: string;
    destination?: string;
    supportTicketId?: string;
    pageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingCategory {
  name: string;
  key: string;
  description: string;
  icon: string;
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface RatingMetrics {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  responseRate: number;
  verifiedRate: number;
  recentTrend: 'improving' | 'declining' | 'stable';
  topTags: Array<{ tag: string; count: number }>;
  categoryBreakdown: RatingCategory[];
}

export interface RatingFilter {
  category?: string;
  rating?: number;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  isVerified?: boolean;
  hasResponse?: boolean;
  search?: string;
}

class RatingSystemService {
  private ratings: Rating[] = [];
  private categories: RatingCategory[] = [];

  constructor() {
    this.initializeCategories();
    this.loadFromStorage();
  }

  private initializeCategories() {
    this.categories = [
      {
        name: 'Shipping Service',
        key: 'shipping',
        description: 'Ratings for delivery quality, speed, and handling',
        icon: '🚚',
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      {
        name: 'Customer Support',
        key: 'support',
        description: 'Ratings for help quality, response time, and resolution',
        icon: '🎧',
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      {
        name: 'Overall Experience',
        key: 'overall',
        description: 'General satisfaction with SkyShip services',
        icon: '⭐',
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      {
        name: 'Website Experience',
        key: 'website',
        description: 'Ratings for website usability and features',
        icon: '💻',
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      {
        name: 'Mobile App',
        key: 'app',
        description: 'Ratings for mobile app functionality and design',
        icon: '📱',
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '4': 0, '5': 0 }
      }
    ];
  }

  private loadFromStorage() {
    try {
      const savedRatings = localStorage.getItem('ratings');
      if (savedRatings) {
        this.ratings = JSON.parse(savedRatings);
        this.updateCategoryMetrics();
      }
    } catch (error) {
      console.error('Error loading ratings from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('ratings', JSON.stringify(this.ratings));
    } catch (error) {
      console.error('Error saving ratings to storage:', error);
    }
  }

  private updateCategoryMetrics() {
    this.categories.forEach(category => {
      const categoryRatings = this.ratings.filter(r => r.category === category.key && r.isModerated && r.moderationStatus === 'approved');
      
      category.totalRatings = categoryRatings.length;
      
      if (category.totalRatings > 0) {
        const totalRating = categoryRatings.reduce((sum, r) => sum + r.rating, 0);
        category.averageRating = Math.round((totalRating / category.totalRatings) * 10) / 10;
        
        // Reset distribution
        category.ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        
        // Count each rating
        categoryRatings.forEach(rating => {
          category.ratingDistribution[rating.rating as keyof typeof category.ratingDistribution]++;
        });
      }
    });
  }

  // Rating Management
  async submitRating(ratingData: Omit<Rating, 'id' | 'createdAt' | 'updatedAt' | 'isModerated' | 'moderationStatus'>): Promise<Rating> {
    try {
      // Validate rating
      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (!ratingData.title.trim() || !ratingData.comment.trim()) {
        throw new Error('Title and comment are required');
      }

      const rating: Rating = {
        ...ratingData,
        id: `rating_${Date.now()}`,
        isModerated: false,
        moderationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.ratings.push(rating);
      this.updateCategoryMetrics();
      this.saveToStorage();

      // Auto-approve high ratings (4-5 stars) for demo purposes
      if (rating.rating >= 4) {
        setTimeout(() => {
          this.approveRating(rating.id);
        }, 1000);
      }

      return rating;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  getRatings(filter?: RatingFilter): Rating[] {
    let filteredRatings = [...this.ratings];

    if (filter?.category) {
      filteredRatings = filteredRatings.filter(r => r.category === filter.category);
    }

    if (filter?.rating) {
      filteredRatings = filteredRatings.filter(r => r.rating === filter.rating);
    }

    if (filter?.dateRange) {
      filteredRatings = filteredRatings.filter(r => 
        r.createdAt >= filter.dateRange!.start && r.createdAt <= filter.dateRange!.end
      );
    }

    if (filter?.tags && filter.tags.length > 0) {
      filteredRatings = filteredRatings.filter(r => 
        filter.tags!.some(tag => r.tags.includes(tag))
      );
    }

    if (filter?.isVerified !== undefined) {
      filteredRatings = filteredRatings.filter(r => r.isVerified === filter.isVerified);
    }

    if (filter?.hasResponse !== undefined) {
      filteredRatings = filteredRatings.filter(r => 
        filter.hasResponse ? !!r.response : !r.response
      );
    }

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filteredRatings = filteredRatings.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.comment.toLowerCase().includes(searchLower) ||
        r.customerName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    return filteredRatings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getRatingById(id: string): Rating | undefined {
    return this.ratings.find(r => r.id === id);
  }

  updateRating(id: string, updates: Partial<Rating>): Rating | null {
    const ratingIndex = this.ratings.findIndex(r => r.id === id);
    if (ratingIndex === -1) return null;

    this.ratings[ratingIndex] = {
      ...this.ratings[ratingIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.updateCategoryMetrics();
    this.saveToStorage();
    return this.ratings[ratingIndex];
  }

  deleteRating(id: string): boolean {
    const initialLength = this.ratings.length;
    this.ratings = this.ratings.filter(r => r.id !== id);
    
    if (this.ratings.length < initialLength) {
      this.updateCategoryMetrics();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Moderation
  approveRating(ratingId: string): Rating | null {
    return this.updateRating(ratingId, {
      isModerated: true,
      moderationStatus: 'approved'
    });
  }

  rejectRating(ratingId: string, notes: string): Rating | null {
    return this.updateRating(ratingId, {
      isModerated: true,
      moderationStatus: 'rejected',
      moderationNotes: notes
    });
  }

  getPendingModeration(): Rating[] {
    return this.ratings.filter(r => !r.isModerated || r.moderationStatus === 'pending');
  }

  // Response Management
  addResponse(ratingId: string, agentId: string, agentName: string, response: string): Rating | null {
    const rating = this.getRatingById(ratingId);
    if (!rating) return null;

    return this.updateRating(ratingId, {
      response: {
        agentId,
        agentName,
        response,
        respondedAt: new Date()
      }
    });
  }

  updateResponse(ratingId: string, response: string): Rating | null {
    const rating = this.getRatingById(ratingId);
    if (!rating || !rating.response) return null;

    return this.updateRating(ratingId, {
      response: {
        ...rating.response,
        response,
        respondedAt: new Date()
      }
    });
  }

  removeResponse(ratingId: string): Rating | null {
    return this.updateRating(ratingId, {
      response: undefined
    });
  }

  // Analytics and Metrics
  getRatingMetrics(): RatingMetrics {
    const approvedRatings = this.ratings.filter(r => r.isModerated && r.moderationStatus === 'approved');
    
    const totalRatings = approvedRatings.length;
    const averageRating = totalRatings > 0 
      ? Math.round((approvedRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings) * 10) / 10
      : 0;

    const ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    approvedRatings.forEach(rating => {
      ratingDistribution[rating.rating as keyof typeof ratingDistribution]++;
    });

    const responseRate = totalRatings > 0 
      ? Math.round((approvedRatings.filter(r => r.response).length / totalRatings) * 100)
      : 0;

    const verifiedRate = totalRatings > 0
      ? Math.round((approvedRatings.filter(r => r.isVerified).length / totalRatings) * 100)
      : 0;

    // Calculate recent trend (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentRatings = approvedRatings.filter(r => r.createdAt >= thirtyDaysAgo);
    const previousRatings = approvedRatings.filter(r => 
      r.createdAt >= sixtyDaysAgo && r.createdAt < thirtyDaysAgo
    );

    let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentRatings.length > 0 && previousRatings.length > 0) {
      const recentAvg = recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length;
      const previousAvg = previousRatings.reduce((sum, r) => sum + r.rating, 0) / previousRatings.length;
      
      if (recentAvg > previousAvg + 0.2) recentTrend = 'improving';
      else if (recentAvg < previousAvg - 0.2) recentTrend = 'declining';
    }

    // Top tags
    const tagCounts: Record<string, number> = {};
    approvedRatings.forEach(rating => {
      rating.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRatings,
      averageRating,
      ratingDistribution,
      responseRate,
      verifiedRate,
      recentTrend,
      topTags,
      categoryBreakdown: this.categories
    };
  }

  getCategoryMetrics(categoryKey: string): RatingCategory | undefined {
    return this.categories.find(c => c.key === categoryKey);
  }

  // Tag Management
  getAllTags(): string[] {
    const allTags = new Set<string>();
    this.ratings.forEach(rating => {
      rating.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  getPopularTags(limit: number = 20): Array<{ tag: string; count: number }> {
    const tagCounts: Record<string, number> = {};
    this.ratings.forEach(rating => {
      rating.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Search and Discovery
  searchRatings(query: string, limit: number = 50): Rating[] {
    const queryLower = query.toLowerCase();
    const results: Array<{ rating: Rating; score: number }> = [];

    this.ratings.forEach(rating => {
      let score = 0;
      
      // Title match (highest weight)
      if (rating.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Comment match
      if (rating.comment.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Tag match
      if (rating.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
        score += 3;
      }
      
      // Customer name match
      if (rating.customerName.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      if (score > 0) {
        results.push({ rating, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.rating);
  }

  // Public Display
  getPublicRatings(category?: string, limit: number = 20): Rating[] {
    let publicRatings = this.ratings.filter(r => 
      r.isModerated && 
      r.moderationStatus === 'approved' && 
      r.isPublic
    );

    if (category) {
      publicRatings = publicRatings.filter(r => r.category === category);
    }

    return publicRatings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getFeaturedRatings(limit: number = 5): Rating[] {
    const approvedRatings = this.ratings.filter(r => 
      r.isModerated && r.moderationStatus === 'approved'
    );

    // Featured ratings are high-rated, recent, and have responses
    return approvedRatings
      .filter(r => r.rating >= 4 && r.response)
      .sort((a, b) => {
        // Sort by rating first, then by recency
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, limit);
  }

  // Export/Import
  exportRatings(): string {
    return JSON.stringify(this.ratings, null, 2);
  }

  importRatings(jsonData: string): boolean {
    try {
      const ratings = JSON.parse(jsonData);
      this.ratings = ratings;
      this.updateCategoryMetrics();
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing ratings:', error);
      return false;
    }
  }

  // Demo Data Generation
  generateDemoData(): void {
    const demoRatings: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        customerId: 'demo_1',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        category: 'shipping',
        rating: 5,
        title: 'Excellent delivery service!',
        comment: 'My package arrived ahead of schedule and in perfect condition. The tracking updates were very helpful.',
        tags: ['fast-delivery', 'tracking', 'careful-handling'],
        isVerified: true,
        isPublic: true,
        isModerated: true,
        moderationStatus: 'approved',
        metadata: {
          shipmentId: 'ship_123',
          trackingNumber: 'TRK123456789',
          serviceType: 'express',
          origin: 'New York',
          destination: 'Los Angeles'
        },
        response: {
          agentId: 'agent_1',
          agentName: 'Mike Chen',
          response: 'Thank you for your feedback, Sarah! We\'re glad we could exceed your expectations.',
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      },
      {
        customerId: 'demo_2',
        customerName: 'David Chen',
        customerEmail: 'david.c@example.com',
        category: 'support',
        rating: 5,
        title: 'Outstanding customer support',
        comment: 'The support team was incredibly helpful when I had an issue with my shipment. They resolved it quickly and professionally.',
        tags: ['helpful', 'quick-response', 'professional'],
        isVerified: true,
        isPublic: true,
        isModerated: true,
        moderationStatus: 'approved',
        metadata: {
          supportTicketId: 'ticket_456'
        },
        response: {
          agentId: 'agent_2',
          agentName: 'Lisa Rodriguez',
          response: 'We appreciate your kind words, David! It\'s our pleasure to help.',
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      {
        customerId: 'demo_3',
        customerName: 'Emily Davis',
        customerEmail: 'emily.d@example.com',
        category: 'overall',
        rating: 4,
        title: 'Great overall experience',
        comment: 'SkyShip has been reliable for all my shipping needs. The website is easy to use and prices are competitive.',
        tags: ['reliable', 'user-friendly', 'competitive-pricing'],
        isVerified: true,
        isPublic: true,
        isModerated: true,
        moderationStatus: 'approved',
        metadata: {},
        response: {
          agentId: 'agent_1',
          agentName: 'Mike Chen',
          response: 'Thank you for your feedback, Emily! We\'re committed to maintaining our high standards.',
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    demoRatings.forEach((ratingData, index) => {
      const rating: Rating = {
        ...ratingData,
        id: `demo_rating_${index + 1}`,
        createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
      };
      this.ratings.push(rating);
    });

    this.updateCategoryMetrics();
    this.saveToStorage();
  }
}

// Create singleton instance
const ratingSystemService = new RatingSystemService();

export default ratingSystemService;
