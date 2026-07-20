.PHONY: dev build start lint docker-up docker-down docker-build docker-logs docker-restart

# ==========================================
# Node/Next.js Commands (Development Lokal)
# ==========================================

# Menjalankan server development secara lokal (sama dengan npm run dev)
dev:
	npm run dev

# Melakukan build aplikasi untuk production (sama dengan npm run build)
build:
	npm run build

# Menjalankan aplikasi setelah proses build (sama dengan npm run start)
start:
	npm run start

# Menjalankan linter untuk mengecek masalah di dalam kode
lint:
	npm run lint


# ==========================================
# Docker Commands (Production & Deployment)
# ==========================================

# Menjalankan aplikasi dengan Docker di background tanpa mem-build ulang
docker-up:
	docker-compose up -d

# Mematikan dan menghapus container Docker yang sedang berjalan
docker-down:
	docker-compose down

# Mem-build ulang image Docker dan langsung menjalankannya 
# (Gunakan ini jika ada perubahan pada kode/env)
docker-build:
	docker-compose up -d --build

# Melihat log output langsung dari dalam container secara real-time
docker-logs:
	docker-compose logs -f

# Melakukan restart pada container (berguna jika server hang/error)
docker-restart:
	docker-compose restart
