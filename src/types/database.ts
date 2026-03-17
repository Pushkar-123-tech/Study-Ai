export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          plan: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          plan?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          plan?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          summary?: string | null;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          question: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          question: string;
          answer: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
        };
      };
      usage: {
        Row: {
          id: string;
          user_id: string;
          notes_generated: number;
          date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notes_generated?: number;
          date?: string;
        };
        Update: {
          notes_generated?: number;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string | null;
          price_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
