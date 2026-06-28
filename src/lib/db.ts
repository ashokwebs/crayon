import mongoose from 'mongoose';

// Ensure we only initialize the connection once in Next.js development
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function initDb() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not set in environment variables. Database features will fail.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB initialized successfully.");
      return mongoose.connection;
    }).catch(async (err) => {
      console.warn("⚠️ Failed to connect to remote MongoDB Atlas. Falling back to local in-memory DB...");
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const fallbackMongoose = await mongoose.connect(uri, opts);
        console.log("✅ Fallback Local MongoDB initialized successfully.");
        return fallbackMongoose.connection;
      } catch (fallbackErr) {
        console.error("❌ Failed to initialize fallback MongoDB:", fallbackErr);
        throw fallbackErr;
      }
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function getDbPool() {
  return cached.conn; // Returns the mongoose connection or null if not yet connected
}

// ----------------------------------------------------------------------------
// Mongoose Schemas & Models
// ----------------------------------------------------------------------------

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'Active' },
  summary_markdown: String,
  architecture_markdown: String,
  marketing_markdown: String,
  finance_markdown: String,
  chat_history: String, // Stringified JSON
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const KnowledgeBaseSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  // Remove pgvector embedding since we are in MongoDB. We'll simulate search if needed or use basic text search.
  // For Atlas Crayon Search, you'd store the embedding as an array of numbers.
  embedding: [Number], 
}, { timestamps: { createdAt: 'created_at' } });
KnowledgeBaseSchema.index({ content: 'text', filename: 'text' }); // Add basic text search index

const ProjectMemorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  project_id: { type: String, required: true },
  category: { type: String, required: true },
  agent_id: String,
  agent_name: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: { createdAt: 'created_at' } });

const AgentTaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  project_id: { type: String, required: true },
  agent_id: { type: String, required: true },
  agent_name: String,
  task_desc: { type: String, required: true },
  priority: { type: String, default: 'medium' },
  status: { type: String, default: 'pending' },
  dependencies: mongoose.Schema.Types.Mixed, // JSON
  output: String,
  external_route_org: String,
  completed_at: Date,
}, { timestamps: { createdAt: 'created_at' } });

const AicooMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  from_agent_id: String,
  from_agent_name: String,
  from_org: String,
  to_agent_id: String,
  to_agent_name: String,
  to_org: String,
  content: String,
  type: String,
  timestamp: Number,
  metadata: mongoose.Schema.Types.Mixed,
});

// Export Models
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const KnowledgeBaseModel = mongoose.models.KnowledgeBase || mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
export const ProjectMemoryModel = mongoose.models.ProjectMemory || mongoose.model('ProjectMemory', ProjectMemorySchema);
export const AgentTaskModel = mongoose.models.AgentTask || mongoose.model('AgentTask', AgentTaskSchema);
export const AicooMessageModel = mongoose.models.AicooMessage || mongoose.model('AicooMessage', AicooMessageSchema);
