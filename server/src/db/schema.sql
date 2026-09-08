CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(50) NOT NULL,
  username    VARCHAR(30) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follows (
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);

SELECT p.*, u.username, u.avatar_url,
       COUNT(l.user_id) AS like_count,
       EXISTS (
         SELECT 1 FROM likes 
         WHERE post_id = p.id AND user_id = $1
       ) AS liked_by_me
FROM posts p
JOIN users u ON u.id = p.user_id
LEFT JOIN likes l ON l.post_id = p.id
WHERE p.user_id IN (
  SELECT following_id FROM follows WHERE follower_id = $1
)
GROUP BY p.id, u.username, u.avatar_url
ORDER BY p.created_at DESC
LIMIT 20 OFFSET $2;