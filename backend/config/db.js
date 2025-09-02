import sql from 'mssql';

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to SQL Server...');
    
    const config = {
      user: 'skyshiplink_user',
      password: 'Bb22092001@#',
      server: 'DESKTOP-5FFLUPP',
      database: 'sky_ship_link',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000
      }
    };

    console.log('📋 Connection config:', {
      server: config.server,
      database: config.database,
      user: config.user
    });

    const pool = await sql.connect(config);
    console.log('✅ SQL Server Connected Successfully!');
    console.log(`   Server: ${config.server}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};

export default connectDB;
export { sql };
